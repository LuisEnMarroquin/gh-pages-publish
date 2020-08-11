const core = require('@actions/core')
const github = require('@actions/github')

try {
  const BRANCH = core.getInput('BRANCH')
  const FOLDER = core.getInput('FOLDER')
  const SSHKEY = core.getInput('SSHKEY')

  console.log(`H1 ${BRANCH}!`)
  console.log(`H2 ${FOLDER}!`)
  console.log(`H3 ${SSHKEY}!`)

  const time = (new Date()).toTimeString()
  core.setOutput('TIME', time)
  const payload = JSON.stringify(github.context.payload, undefined, 2) // Get the JSON webhook payload for the event that triggered the workflow
  console.log(`The event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}
