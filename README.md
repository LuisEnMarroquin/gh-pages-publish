# GitHub Pages publish javascript action

This action sends your build folder to a new/existing branch.

## Inputs

### `BRANCH`

**Optional** The branch where your compiled files will be moved. Default `gh-pages`.

### `FOLDER`

**Required** The folder where your compiled files are.

### `SSHKEY`

**Required** Your GitHub SSH access key.

## Outputs

### `TIMING`

The time we greeted you.

## Example usage

```yml
uses: LuisEnMarroquin/gh-pages-publish@v1.4
with:
  BRANCH: gh-pages
  FOLDER: dist
  SSHKEY: ${{ secrets.SSH }}
```

## Publish action

Remember to change the version number first for all files

```shell
# Update your dist/index.js
npm run build

# Add all files
git add .

# Commit the files
git commit -m "Use zeit/ncc"

# Tag your release
git tag -a -m "My first action release" v1.4

# Push commit and tags
git push --follow-tags
```

## References

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
