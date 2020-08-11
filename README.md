# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yml
uses: LuisEnMarroquin/gh-pages-publish@v1.0
with:
  who-to-greet: 'Mona the Octocat'
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
git tag -a -m "My first action release" v1.0

# Push your tags
git push --follow-tags
```

## References

* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
