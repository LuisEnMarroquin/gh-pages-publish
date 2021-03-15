# GitHub Pages Publish GitHub Action

![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/macos.yml/badge.svg)
![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/ubuntu.yml/badge.svg)

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
name: macOS

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v1
    - uses: LuisEnMarroquin/gh-pages-publish@v2.3.5
      with:
        BRANCH: gh-pages-mac
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
git tag -a -m "Published v2.3.5" v2.3.5 # Tag your release
git push --follow-tags # Push commit and tags
```

-->
