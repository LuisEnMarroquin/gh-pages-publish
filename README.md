# GitHub Pages Publish - GitHub Action

[![Fail](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/windows.yml/badge.svg)](https://github.com/LuisEnMarroquin)
[![Fail](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/macos.yml/badge.svg)](https://github.com/LuisEnMarroquin)
[![Fail](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/ubuntu.yml/badge.svg)](https://github.com/LuisEnMarroquin)

This action sends your project build folder to a new/existing branch, example **gh-pages**

## Example usage

```yml
name: Ubuntu

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: LuisEnMarroquin/gh-pages-publish@v2.4.4
      with:
        FOLDER: dist
        SSHKEY: ${{ secrets.SSH }}
```

## Inputs

| Key      | Value Information                                                 | Required |
| -------- | ----------------------------------------------------------------- | -------- |
| `BRANCH` | The branch where the project will be deployed, default `gh-pages` | **No**   |
| `FOLDER` | The folder where your files that will be deployed are located     | **Yes**  |
| `SSHKEY` | Your GitHub SSH access key, this comes from GitHub Secrets        | **Yes**  |

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

## Outputs

| Key      | Value Information                           |
| -------- | ------------------------------------------- |
| `TIMING` | The time when the action finished execution |
