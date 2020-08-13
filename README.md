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
uses: LuisEnMarroquin/gh-pages-publish@v1.7
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
git tag -a -m "My first action release" v1.7 # Tag your release
git push --follow-tags # Push commit and tags
```

## References

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
