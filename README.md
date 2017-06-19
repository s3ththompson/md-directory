# md-directory

[![npm version](https://img.shields.io/npm/v/md-directory.svg?style=flat-square)](https://npmjs.org/package/md-directory) [![build status](https://img.shields.io/travis/s3ththompson/md-directory/master.svg?style=flat-square)](https://travis-ci.org/s3ththompson/md-directory)

Convert a directory of Markdown files to HTML.

Uses the [commonmark](https://github.com/jgm/commonmark.js) Markdown renderer and the [gray-matter](https://github.com/jonschlinkert/gray-matter) frontmatter parser.

## Install

Install with [npm](https://github.com/npm/npm):

```sh
npm install --save md-directory
```

or, if using [Yarn](https://github.com/yarnpkg/yarn):

```sh
yarn add md-directory
```

## Usage

Given a directory `posts` with a file `hi.md`:

```md
---
title: foo
---
# bar
```

```javascript
var md = require('md-directory')
md.parseDirSync('./posts')
```

returns:

```js
{
  "hi.md": {
    "orig": "---\ntitle: foo\n---\n# bar",
    "data": {
      "title": "foo"
    },
    "content": "<h1>bar</h1>\n"
  }
}
```

## Inlining results with Browserify

Use [transform.js](transform.js) to convert calls to `md-directory` methods into the contents they return. It is highly recommended that you use the synchronous methods `md.parseDirSync` and `md.parseSync` with Browserify.

### Source

```js
var path = require('path')
var md = require('md-directory')
var contents = md.parseDirSync(path.join(__dirname, 'posts'))
```

### Browserify

```sh
browserify index.js -t md-directory/transform -o bundle.js 
```

### Output

```js
var contents = {"hi.md":{"orig":"---\ntitle: foo\n---\n# bar","data":{"title":"foo"},"content":"<h1>bar</h1>\n"}};
```

Note: to use this transform, the path to the file directory can not be a variable. If you use the async methods, the callback must be an ES5 function (not an ES6 arrow function) and the results will be inlined with `process.nextTick`. See [brfs](https://github.com/substack/brfs#async) for more details on this behavior.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### parseDir

Read the contents of a directory and convert to Markdown asynchronously

**Parameters**

-   `dir` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – The directory to read
-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `opts.md` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse markdown, default: commonmark
    -   `opts.frontmatter` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse frontmatter, default: gray-matter
    -   `opts.encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – encoding of files, default: `utf8`
    -   `opts.filter` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – glob pattern for filtering files, default: `**\/*.md`
    -   `opts.ignore` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – glob pattern for ignoring files
    -   `opts.ignore` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** – array of glob patterns for ignoring files
    -   `opts.extensions` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** – include or exclude file extensions in keys of returned object, default: `false`
    -   `opts.dirnames` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** – include or exclude subdirectory names in keys of returned object, default: `false`
    -   `opts.transform` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – A function you can use to transform the contents of files after they are converted
-   `cb`  

**Examples**

```javascript
var md = require('md-directory')
md.parseDir('./posts', function (err, contents) {
  console.log(contents)
})
```

### parseDirSync

Read the contents of a directory and convert to Markdown synchronously

**Parameters**

-   `dir` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – The directory to read
-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `opts.md` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse markdown, default: commonmark
    -   `opts.frontmatter` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse frontmatter, default: gray-matter
    -   `opts.encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – encoding of files, default: `utf8`
    -   `opts.filter` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – glob pattern for filtering files, default: `**\/*.md`
    -   `opts.ignore` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – glob pattern for ignoring files
    -   `opts.ignore` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** – array of glob patterns for ignoring files
    -   `opts.extensions` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** – include or exclude file extensions in keys of returned object, default: `false`
    -   `opts.dirnames` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** – include or exclude subdirectory names in keys of returned object, default: `false`
    -   `opts.transform` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – A function you can use to transform the contents of files after they are converted

**Examples**

```javascript
var md = require('md-directory')
var contents = md.parseDirSync('./posts')
```

### parse

Read the contents of a file and convert to Markdown asynchronously

**Parameters**

-   `filename` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – The filename to read
-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `opts.md` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse markdown, default: commonmark
    -   `opts.frontmatter` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse frontmatter, default: gray-matter
    -   `opts.encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – encoding of files, default: `utf8`
    -   `opts.transform` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – A function you can use to transform the contents of files after they are converted
-   `cb`  

**Examples**

```javascript
var md = require('md-directory')
md.parse('./post.md', function (err, contents) {
  console.log(contents)
})
```

### parseSync

Read the contents of a file and convert to Markdown synchronously

**Parameters**

-   `filename` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – The filename to read
-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `opts.md` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse markdown, default: commonmark
    -   `opts.frontmatter` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** alternate function to parse frontmatter, default: gray-matter
    -   `opts.encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – encoding of files, default: `utf8`
    -   `opts.transform` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – A function you can use to transform the contents of files after they are converted

**Examples**

```javascript
var md = require('md-directory')
var contents = md.parseSync('./post.md')
```

## See also

-   [sethvincent/read-directory](https://github.com/sethvincent/read-directory)
-   [substack/brfs](https://github.com/substack/brfs)

## License

[MIT](LICENSE.md)
