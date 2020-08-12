const { existsSync, rmdirSync, unlinkSync } = require('fs')
const { join } = require('path')

const sshFolder = join(__dirname, '.ssh/')

if (existsSync(sshFolder)) {
  let config = join(sshFolder, 'config')
  let github = join(sshFolder, 'github')
  if (existsSync(config)) unlinkSync(config)
  if (existsSync(github)) unlinkSync(github)
  rmdirSync(sshFolder)
}

const gitconfigFile = join(__dirname, '.gitconfig')
if (existsSync(gitconfigFile)) unlinkSync(gitconfigFile)
