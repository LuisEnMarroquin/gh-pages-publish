# GitHub Pages publish javascript action

![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)
![GitHub](https://github.com/LuisEnMarroquin/gh-pages-publish/workflows/Testing/badge.svg)

This action sends your build folder to a new/existing branch.

Note: Only works for macOS and Linux hosts.

## Inputs

### `BRANCH`

**Optional** The branch where your compiled files will be moved. Default `gh-pages`.

### `DELETE`

**Optional** Should delete the commit history. Default `false`.

### `FOLDER`

**Required** The folder where your compiled files are.

### `SSHKEY`

**Required** Your GitHub SSH access key.

## Outputs

### `TIMING`

The time when this action finished execution.

## Example usage

```yml
- name: Deploy to gh-pages
  uses: LuisEnMarroquin/gh-pages-publish@v1.9-omega-4
  with:
    BRANCH: gh-pages
    FOLDER: dist
    SSHKEY: ${{ secrets.SSH }}
```

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
git add . # Add all files
git commit -m "Use zeit/ncc" # Commit the files
git tag -a -m "My first action release" v1.9-omega-4 # Tag your release
git push --follow-tags # Push commit and tags
```

## References

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
