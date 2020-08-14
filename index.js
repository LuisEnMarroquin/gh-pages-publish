const { join } = require('path')
const { homedir } = require('os')
const core = require('@actions/core')
const { execSync } = require('child_process')
const { context } = require('@actions/github')
const { existsSync, writeFileSync } = require('fs')

try {
  let exec = (command) => {
    console.log('exec', command.length, command)
    let result = execSync(command, { encoding: 'utf-8' })
    console.log('result', result)
    return result
  }

  let rmLineBreaks = (text) => {
    text = text.replace('\r\n', '') // Windows
    text = text.replace('\n', '') // Unix
    return text
  }

  let branchExists = (branch) => {
    let remoteExists = rmLineBreaks(exec(`git ls-remote --heads origin ${branch}`))
    return (remoteExists.length > 0)
  }

  let removeBranch = () => { // Removes local and remote branch
    console.log('Deleting branch')
    try {
      exec(`git branch -d ${BRANCH}`)
    } catch (error) {
      console.error({ error })
    }
    try {
      exec(`git push --delete origin ${BRANCH}`)
    } catch (error) {
      console.error({ error })
    }
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
  if (!existsSync(sshFolder)) exec(`mkdir ${sshFolder}`) // Create SSH folder if doesn't exists

  const sshGithub = join(BASEPATH, '.ssh', 'key') // SSH key file location
  if (existsSync(sshGithub)) exec(`rm ${sshGithub}`)
  writeFileSync(sshGithub, SSHKEY)

  const sshConfig = join(BASEPATH, '.ssh', 'config') // SSH config file location
  if (existsSync(sshConfig)) exec(`rm ${sshConfig}`)
  writeFileSync(sshConfig, 'Host github.com\n  HostName github.com\n  IdentityFile ~/.ssh/key\n  StrictHostKeyChecking no\n')

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

  exec(`git config --global user.name "${userName}"`)
  exec(`git config --global user.email "${userMail}"`)
  exec(`git config --global pull.rebase true`)

  if (process.argv[2] !== 'dev') { // Shouldn't run this on my local machine
    if (DELETE === true || DELETE === 'true') removeBranch()
    let randomNumber = Math.floor(Math.random() * 9876543210) + 1
    let runDif = `${BRANCH}-${branchHead}-${randomNumber}`
    let pagesDirectory = `../publishFolder-${runDif}` // Folder where compilled files will be moved
    let buildCompression = `../pubFolder-${runDif}.tar.gz`
    let gitCompression = `../gitFolder-${runDif}.tar.gz`
    exec(`mkdir ${pagesDirectory}`) // Create publish folder
    exec(`tar -C ${FOLDER} -czvf ${buildCompression} ./`) // Compressing build folder
    exec(`tar xvzf ${buildCompression} -C ${pagesDirectory}/`) // Uncompress build folder
    exec(`git stash`) // Remove any change to the folder to allow branch changing
    if (!branchExists(BRANCH)) {
      console.log('Creating new branch')
      exec(`git checkout --orphan ${BRANCH}`) // Create branch if doesn't exist
    } else {
      console.log('Branch existed previously')
      exec(`git fetch origin ${BRANCH}`) // Pull branch from remote
      exec(`git checkout ${BRANCH}`) // Change to existing branch if exists
      exec(`git pull`) // Pull branch from remote
    }
    exec(`tar -czvf ${gitCompression} .git/`) // Compressing .git folder
    exec(`tar xvzf ${gitCompression} -C ${pagesDirectory}/`) // Uncompress .git folder
    exec(`ls ${pagesDirectory} -a`) // List files in folder to publish
    exec(`git --git-dir=${pagesDirectory}/.git --work-tree=${pagesDirectory} rm -r --cached . -f`)
    exec(`git --git-dir=${pagesDirectory}/.git --work-tree=${pagesDirectory} status`)
    exec(`git --git-dir=${pagesDirectory}/.git --work-tree=${pagesDirectory} add . --verbose`)
    exec(`git --git-dir=${pagesDirectory}/.git --work-tree=${pagesDirectory} commit -m "${commitMessage}" --verbose`)
    exec(`git --git-dir=${pagesDirectory}/.git --work-tree=${pagesDirectory} push --set-upstream origin ${BRANCH}`)
    exec(`rm -rf ${gitCompression} ${buildCompression} ${pagesDirectory}`)
  }

  const time = (new Date()).toTimeString()
  core.setOutput('TIMING', time)
} catch (error) {
  core.setFailed(error.message)
}
