# GitHub Pages Publish GitHub Action

![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/workflows/macOS/badge.svg)
![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/workflows/Ubuntu/badge.svg)

This action sends your build folder to a new/existing branch.

Note: This action only works for `Linux` and `macOS` hosts, this means no `Windows`.

## Inputs

### `BRANCH`

**Optional** The branch where your project will be deployed. Default `gh-pages`.

### `FOLDER`

**Required** The folder where your files that will be deployed are.

### `SSHKEY`

**Required** Your GitHub SSH access key, this is readed from GitHub Secrets.

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

## Outputs

### `TIMING`

The time when this action finished execution.

## Example usage

```yml
name: Deployment

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: LuisEnMarroquin/gh-pages-publish@v2.3.3
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
git tag -a -m "Published v2.3.3" v2.3.3 # Tag your release
git push --follow-tags # Push commit and tags
```

-->

## References

* [Inspired by JamesIves action](https://github.com/JamesIves/github-pages-deploy-action)
