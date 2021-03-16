# GitHub Pages Publish - GitHub Action

[![Fail](https://github.com/LuisEnMarroquin/gh-pages-publish/actions/workflows/deploy.yml/badge.svg)](https://github.com/LuisEnMarroquin)

This action sends your project build folder to a new/existing branch

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
    - uses: LuisEnMarroquin/gh-pages-publish@v2.4.3
      with:
        FOLDER: dist
        SSHKEY: ${{ secrets.SSH }}
```

## Inputs

| Key      | Value Information                                                  | Required |
| -------- | ------------------------------------------------------------------ | -------- |
| `BRANCH` | The branch where your project will be deployed, default `gh-pages` | **No**   |
| `FOLDER` | The folder where your files that will be deployed are located      | **Yes**  |
| `SSHKEY` | Your GitHub SSH access key, this comes from GitHub Secrets         | **Yes**  |

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

## Outputs

| Key      | Value Information                           |
| -------- | ------------------------------------------- |
| `TIMING` | The time when the action finished execution |
