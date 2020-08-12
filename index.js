const { join } = require('path')
const { homedir } = require('os')
const core = require('@actions/core')
const github = require('@actions/github')
const { execSync } = require('child_process')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

try {
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
  if (!existsSync(sshConfig)) writeFileSync(sshConfig, 'Host github.com\n  HostName github.com\n  IdentityFile ~/.ssh/github\n')

  const gitconfigFile = join(BASEPATH, '.gitconfig') // Git config file location
  if (!existsSync(gitconfigFile)) writeFileSync(gitconfigFile, '[user]\n  name = LuisEnMarroquin\n  email = mluis651@gmail.com\n')

  let branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }) // Get branch name from git
  console.log({ branchName })
  branchName = branchName.replace('\r\n', '') // Windows
  branchName = branchName.replace('\n', '') // Unix
  console.log({ branchName })

  const time = (new Date()).toTimeString()
  core.setOutput('TIMING', time)

  const payload = JSON.stringify(github.context.payload, undefined, 2) // Get the JSON webhook payload for the event that triggered the workflow
  console.log(`The event payload is: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}
