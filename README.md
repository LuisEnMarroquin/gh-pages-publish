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
    - uses: LuisEnMarroquin/gh-pages-publish@v2.4.0
      with:
        FOLDER: dist
        SSHKEY: ${{ secrets.SSH }}
```
