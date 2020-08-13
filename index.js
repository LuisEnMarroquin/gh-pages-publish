const { join } = require('path')
const { homedir } = require('os')
const core = require('@actions/core')
const { execSync } = require('child_process')
const { context } = require('@actions/github')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

try {
  let exec = (command) => execSync(command, { encoding: 'utf-8' })

  let rmLineBreaks = (text) => {
    text = text.replace('\r\n', '') // Windows
    text = text.replace('\n', '') // Unix
    return text
  }

  let branchExists = (branch) => {
    let remoteExists = rmLineBreaks(exec(`git ls-remote --heads origin ${branch}`))
    return (remoteExists.length > 0)
  }

  let BASEPATH = homedir()
  let BRANCH = core.getInput('BRANCH')
  let DELETE = core.getInput('DELETE')
  let FOLDER = core.getInput('FOLDER')
  let SSHKEY = core.getInput('SSHKEY')

  if (process.argv[2] === 'dev') {
    BASEPATH = __dirname
    DELETE = false
    BRANCH = 'gh-pages'
    FOLDER = 'dist'
    SSHKEY = 'my-ssh-key'
  }

  const sshFolder = join(BASEPATH, '.ssh/') // SSH folder location
  if (!existsSync(sshFolder)) mkdirSync(sshFolder) // Create SSH folder if doesn't exists

  const sshConfig = join(BASEPATH, '.ssh', 'config') // SSH config file location
  if (!existsSync(sshConfig)) writeFileSync(sshConfig, 'Host github.com\n  HostName github.com\n  IdentityFile ~/.ssh/github\n  StrictHostKeyChecking no\n')

  const sshGithub = join(BASEPATH, '.ssh', 'github') // SSH github file location
  if (!existsSync(sshGithub)) writeFileSync(sshGithub, SSHKEY)

  let branchName = rmLineBreaks(exec('git rev-parse --abbrev-ref HEAD')) // Get branch name from git
  let branchHead = rmLineBreaks(exec('git show --format="%h" --no-patch')) // Get branch name from git

  const commitMessage = `Deploy to ${BRANCH} from ${branchName} @ ${branchHead} 🚀`
  const payload = context.payload
  let userName = 'LuisEnMarroquin'
  let userMail = 'mluis651@gmail.com'
  try {
    userName = payload.pusher ? payload.pusher.name : userName
    userMail = payload.pusher ? payload.pusher.email : userMail
  } catch (error) {
    console.error({ error })
    const payloadString = JSON.stringify(payload, undefined, 2) // Get the JSON webhook payload for the event that triggered the workflow
    console.log(`The event payload is: ${payloadString}`)
  }

  exec(`git config --global pull.rebase true`)
  exec(`git config --global user.name "${userName}"`)
  exec(`git config --global user.email "${userMail}"`)

  if (process.argv[2] !== 'dev') { // Shouldn't run this on my local machine
    if (DELETE) { // Removes local and remote branch
      console.log('Deleting branch')
      console.log(21, exec(`git branch -d ${BRANCH} || true`))
      console.log(22, exec(`git push --delete origin ${BRANCH} || true`))
    }
    exec(`git stash`) // Remove any change to build folder
    let pd = `publishFolder-${branchHead}` // File where compilled files will be moved
    mkdirSync(`../${pd}`) // Create publish folder
    console.log(1, exec(`tar -C ${FOLDER} -czvf ../pubFolder.tar.gz ./`)) // Compressing build folder
    console.log(2, exec(`tar xvzf ../pubFolder.tar.gz -C ../${pd}/`)) // Uncompress build folder
    if (!branchExists(BRANCH)) {
      console.log(18, 'Creating new branch')
      exec(`git checkout --orphan ${BRANCH}`) // Create branch if doesn't exist
    } else {
      console.log(11, exec(`git fetch origin ${BRANCH}`)) // Pull branch from remote
      console.log(12, exec(`git checkout ${BRANCH}`)) // Change to existing branch if exists
      console.log(13, exec(`git pull`)) // Pull branch from remote
      console.log(14, exec(`git rm -r --cached . -f`)) // Untracking previous files
    }
    console.log(3, exec(`tar -czvf ../gitFolder.tar.gz .git/`)) // Compressing .git folder
    console.log(4, exec(`tar xvzf ../gitFolder.tar.gz -C ../${pd}/`)) // Uncompress .git folder
    console.log(5, exec(`git --git-dir=../${pd}/.git --work-tree=../${pd} status`))
    console.log(6, exec(`git --git-dir=../${pd}/.git --work-tree=../${pd} add .`))
    console.log(7, exec(`git --git-dir=../${pd}/.git --work-tree=../${pd} commit -m "${commitMessage}"`))
    console.log(8, exec(`git --git-dir=../${pd}/.git --work-tree=../${pd} push --set-upstream origin ${BRANCH}`))
  }

  const time = (new Date()).toTimeString()
  core.setOutput('TIMING', time)
} catch (error) {
  core.setFailed(error.message)
}
