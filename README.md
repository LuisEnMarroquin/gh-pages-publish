# GitHub Pages Publish - GitHub Action

![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/deploy.yml/badge.svg)

This action sends your build folder to a new/existing branch.

Note: This action only works for `macOS` and `Ubuntu` hosts, this means no `Windows`.

## Inputs

### `BRANCH`

**Optional** The branch where your project will be deployed. Default `gh-pages`.

### `FOLDER`

**Required** The folder where your files that will be deployed are.

### `SSHKEY`

**Required** Your GitHub SSH access key, this comes from GitHub Secrets.

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

## Outputs

### `TIMING`

The time when this action finished execution.

## Example usage

```yml
name: Testing

on:
  push:
    branches:
    - main

jobs:
  ubuntu:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: LuisEnMarroquin/gh-pages-publish@v2.3.7
      with:
        FOLDER: dist
        SSHKEY: ${{ secrets.SSH }}
```

<!--

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
git add . # Add all files
git commit -m "Use zeit/ncc" # Commit the files
git tag -a -m "Published v2.3.7" v2.3.7 # Tag your release
git push --follow-tags # Push commit and tags
```

-->
