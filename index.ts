import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { execSync } from "child_process";

try {
  const isWin = process.platform === "win32" ? true : false;

  const exec = (command: string, display = true) => {
    if (display) console.log("exec", command.length, command);
    const result = execSync(command, { encoding: "utf-8", shell: isWin ? "sh.exe" : "/bin/sh", timeout: 60000 });
    if (display) console.log(result);
    return result.replace(/(?:\r\n|\r|\n)/g, "");
  };

  const branchExists = (branch: string) => (exec(`git ls-remote --heads origin ${branch}`).length > 0 ? true : false);

  const BRANCH = getInput("BRANCH");
  const FOLDER = getInput("FOLDER");
  const SSHKEY = getInput("SSHKEY");

  const branchName = exec("git rev-parse --abbrev-ref HEAD"); // Get branch name from git
  const branchHead = exec('git show --format="%h" --no-patch'); // Get branch name from git
  const cmtMessage = `Deploy to ${BRANCH} from ${branchName} @ ${branchHead} 🚀`;

  let userName = "LuisEnMarroquin",
    userEmail = "mluis651@gmail.com";
  try {
    userName = context.payload.pusher ? context.payload.pusher.name || userName : userName;
    userEmail = context.payload.pusher ? context.payload.pusher.email || userEmail : userEmail;
  } catch (error) {
    console.error("Payload errors", { error });
    console.error("Payload string", JSON.stringify(context.payload, undefined, 2));
  }

  exec(`git config --global user.name "${userName}"`);
  exec(`git config --global user.email "${userEmail}"`);
  exec("git config --global pull.rebase true");

  const sshFolder = "~/.ssh/",
    sshGithub = "~/.ssh/github";
  exec(`mkdir -p ${sshFolder} && chmod 755 ${sshFolder}`);
  exec(`echo "${SSHKEY}" > ${sshGithub} && chmod 600 ${sshGithub}`, false);
  exec(`echo "Host github.com\n  HostName github.com\n  IdentityFile ${sshGithub}\n  StrictHostKeyChecking no\n" > ~/.ssh/config`);

  const oldOrigin = exec("git remote get-url origin"); // Get https origin
  const newOrigin = oldOrigin.replace("https://github.com/", "git@github.com:") + ".git"; // Create ssh origin from https origin
  exec(`git remote set-url origin ${newOrigin}`); // Set new ssh origin

  const pagesDir = `~/publishFolder-${BRANCH}-${branchHead}`;
  exec(`mkdir -p ${pagesDir} && cp -aR ${FOLDER}/. ${pagesDir}`); // Copy build files to publish folder
  exec("git stash"); // Remove any change to the folder to allow branch change
  if (!branchExists(BRANCH)) exec(`git checkout --orphan ${BRANCH}`); // Create branch if doesn't exist
  else exec(`git fetch origin ${BRANCH} && git checkout ${BRANCH}`); // Change to existing branch

  exec(`cp -aR .git/. ${pagesDir}/.git`); // Copy .git folder
  exec(`ls -a ${pagesDir}`); // List files in folder to publish
  exec(`cd ${pagesDir} && git config user.name ${userName}`);
  exec(`cd ${pagesDir} && git config user.email ${userEmail}`);
  exec(`cd ${pagesDir} && git rm -r --cached . -f`);
  exec(`cd ${pagesDir} && git status`);
  exec(`cd ${pagesDir} && git add . --verbose`);
  exec(`cd ${pagesDir} && git commit --allow-empty -m "${cmtMessage}" --verbose`);
  exec(`cd ${pagesDir} && git push -f --set-upstream origin ${BRANCH}`);
  exec(`rm -rf ${pagesDir}`);

  setOutput("TIMING", new Date().toTimeString());
} catch (error: any) {
  setFailed(error.message);
}
