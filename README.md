# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `BRANCH`

**Optional** The branch where your compiled files will be moved. Default `gh-pages`.

### `FOLDER`

**Required** The folder where your compiled files are.

### `SSHKEY`

**Required** Your GitHub SSH access key.

## Outputs

### `TIME`

The time we greeted you.

## Example usage

```yml
uses: LuisEnMarroquin/gh-pages-publish@v1.1
with:
  BRANCH: gh-pages
  FOLDER: dist
  SSHKEY: ${{ secrets.SSH }}
```

## Publish action

```shell
# Update your dist/index.js
npm run build

# Add all files
git add .

# Commit them
git commit -m "Use zeit/ncc"

# Tag your release
git tag -a -m "My first action release" v1.1

# Push your tags
git push --follow-tags
```

## References

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
