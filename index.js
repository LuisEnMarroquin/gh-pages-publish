const { join } = require('path')
const { homedir } = require('os')
const core = require('@actions/core')
const github = require('@actions/github')
const { execSync } = require('child_process')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

try {
  let removeLineBreaks = (text) => {
    text = text.replace('\r\n', '') // Windows
    text = text.replace('\n', '') // Unix
    return text
  }

  let branchExists = (branch) => {
    let remoteExists = removeLineBreaks(execSync(`git ls-remote --heads origin ${branch}`, { encoding: 'utf-8' }))
    return (remoteExists.length > 0 ? true : false)
  }

  let BASEPATH = homedir()
  let BRANCH = core.getInput('BRANCH')
  let FOLDER = core.getInput('FOLDER')
  let SSHKEY = core.getInput('SSHKEY')

  if (process.argv[2] === 'dev') {
    BASEPATH = __dirname
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

  let branchName = removeLineBreaks(execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' })) // Get branch name from git
  let branchHead = removeLineBreaks(execSync('git show --format="%h" --no-patch', { encoding: 'utf-8' })) // Get branch name from git

  const commitMessage = `Deploy to ${BRANCH} from ${branchName} @ ${branchHead} 🚀`

  const payload = github.context.payload
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

  let exist1 = branchExists(BRANCH)
  console.log(exist1)
  let exist2 = branchExists('master')
  console.log(exist2)

  if (process.argv[2] !== 'dev') { // Shouldn't run this on my local machine
    // TODO: Copy files
    console.log('production')
    execSync(`git stash`, { encoding: 'utf-8' }) // Remove any change to build folder
    if (!branchExists(BRANCH)) execSync(`git checkout -b ${BRANCH}`, { encoding: 'utf-8' }) // Create branch if doesn't exist
  }

  const gitConFile = join(BASEPATH, '.gitconfig') // Git config file location
  if (!existsSync(gitConFile)) writeFileSync(gitConFile, `[user]\n  name = ${userName}\n  email = ${userMail}\n`)

  const time = (new Date()).toTimeString()
  core.setOutput('TIMING', time)
} catch (error) {
  core.setFailed(error.message)
}
