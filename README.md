# GitHub Pages Publish JavaScript Action

![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)
![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/workflows/Testing/badge.svg)

This action sends your build folder to a new/existing branch.

Note 1: This doesn't work with `actions/checkout@v1`, use `actions/checkout@v2`

Note 2: This action only works for `Linux` and `macOS` hosts, this means no `Windows`.

Note 3: Please use the latest version avaliable, previous versions may have more errors.

## Inputs

### `BRANCH`

**Optional** The branch where your project will be deployed. Default `gh-pages`.

### `DELETE`

**Optional** If should delete the commit history of the deploy branch. Default `false`.

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
name: Deploy to gh-pages

on:
  push:
    branches:
    - master

jobs:
  deploy:
  - uses: actions/checkout@v2
  - name: Deploy to gh-pages
    uses: LuisEnMarroquin/gh-pages-publish@v2.2.1
    with:
      FOLDER: dist
      SSHKEY: ${{ secrets.SSH }}
```

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
git add . # Add all files
git commit -m "Use zeit/ncc" # Commit the files
git tag -a -m "Published v2.2.1" v2.2.1 # Tag your release
git push --follow-tags # Push commit and tags
```

## References

* [Inspired by JamesIves action](https://github.com/JamesIves/github-pages-deploy-action)

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
