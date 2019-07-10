const read = require('read-directory');
const defaults = require('defaults');
const compose = require('lodash/flow');
const commonmark = require('commonmark');
const matter = require('gray-matter');
const fs = require('fs');

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();

function markdown(str) {
  var parsed = reader.parse(str);
  return writer.render(parsed);
}

var mdOptions = {
  md: markdown,
  frontmatter: matter,
  filter: '**/*.md',
  encoding: 'utf8',
  original: false
};

function parseContent(markdown) {
  return function(obj) {
    obj.content = markdown(obj.content);
    return obj;
  };
}

function removeOriginal(obj) {
  delete obj.orig;
  return obj;
}

/**
 * Read the contents of a directory and convert to Markdown asynchronously
 * @name parseDir
 * @param {String} dir – The directory to read
 * @param {Object} opts
 * @param {Function} opts.md - alternate function to parse markdown, default: commonmark
 * @param {Function} opts.frontmatter - alternate function to parse frontmatter, default: gray-matter
 * @param {String} opts.encoding – encoding of files, default: `utf8`
 * @param {String} opts.filter – glob pattern for filtering files, default: `**\/*.md`
 * @param {String} opts.ignore – glob pattern for ignoring files
 * @param {Array} opts.ignore – array of glob patterns for ignoring files
 * @param {Boolean} opts.extensions – include or exclude file extensions in keys of returned object, default: `false`
 * @param {Boolean} opts.dirnames – include or exclude subdirectory names in keys of returned object, default: `false`
 * @param {Boolean} opts.original – include original file contents in returned object, default: `false`
 * @param {Function} opts.transform – A function you can use to transform the contents of files after they are converted
 * @example
 * var md = require('md-directory')
 * md.parseDir('./posts', function (err, contents) {
 *   console.log(contents)
 * })
 **/
module.exports.parseDir = function parseDir(dir, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = defaults(opts, mdOptions);
  var transforms = [opts.frontmatter, parseContent(opts.md)];
  if (!opts.original) transforms.push(removeOriginal);
  if (opts.transform) transforms.push(opts.transform);
  opts.transform = compose(transforms);
  read(dir, opts, cb);
};

/**
 * Read the contents of a directory and convert to Markdown synchronously
 * @name parseDirSync
 * @param {String} dir – The directory to read
 * @param {Object} opts
 * @param {Function} opts.md - alternate function to parse markdown, default: commonmark
 * @param {Function} opts.frontmatter - alternate function to parse frontmatter, default: gray-matter
 * @param {String} opts.encoding – encoding of files, default: `utf8`
 * @param {String} opts.filter – glob pattern for filtering files, default: `**\/*.md`
 * @param {String} opts.ignore – glob pattern for ignoring files
 * @param {Array} opts.ignore – array of glob patterns for ignoring files
 * @param {Boolean} opts.extensions – include or exclude file extensions in keys of returned object, default: `false`
 * @param {Boolean} opts.dirnames – include or exclude subdirectory names in keys of returned object, default: `false`
 * @param {Boolean} opts.original – include original file contents in returned object, default: `false`
 * @param {Function} opts.transform – A function you can use to transform the contents of files after they are converted
 * @example
 * var md = require('md-directory')
 * var contents = md.parseDirSync('./posts')
 **/
module.exports.parseDirSync = function parseDirSync(dir, opts) {
  opts = defaults(opts, mdOptions);
  var transforms = [opts.frontmatter, parseContent(opts.md)];
  if (!opts.original) transforms.push(removeOriginal);
  if (opts.transform) transforms.push(opts.transform);
  opts.transform = compose(transforms);
  return read.sync(dir, opts);
};

/**
 * Read the contents of a file and convert to Markdown asynchronously
 * @name parse
 * @param {String} filename – The filename to read
 * @param {Object} opts
 * @param {Function} opts.md - alternate function to parse markdown, default: commonmark
 * @param {Function} opts.frontmatter - alternate function to parse frontmatter, default: gray-matter
 * @param {String} opts.encoding – encoding of files, default: `utf8`
 * @param {Boolean} opts.original – include original file contents in returned object, default: `false`
 * @param {Function} opts.transform – A function you can use to transform the contents of files after they are converted
 * @example
 * var md = require('md-directory')
 * md.parse('./post.md', function (err, contents) {
 *   console.log(contents)
 * })
 **/
module.exports.parse = function parse(filename, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = defaults(opts, mdOptions);
  var transforms = [opts.frontmatter, parseContent(opts.md)];
  if (!opts.original) transforms.push(removeOriginal);
  if (opts.transform) transforms.push(opts.transform);
  opts.transform = compose(transforms);
  fs.readFile(filename, { encoding: opts.encoding }, function(err, data) {
    if (err) return cb(err);
    var data = opts.transform(data);
    cb(null, data);
  });
};

/**
 * Read the contents of a file and convert to Markdown synchronously
 * @name parseSync
 * @param {String} filename – The filename to read
 * @param {Object} opts
 * @param {Function} opts.md - alternate function to parse markdown, default: commonmark
 * @param {Function} opts.frontmatter - alternate function to parse frontmatter, default: gray-matter
 * @param {String} opts.encoding – encoding of files, default: `utf8`
 * @param {Boolean} opts.original – include original file contents in returned object, default: `false`
 * @param {Function} opts.transform – A function you can use to transform the contents of files after they are converted
 * @example
 * var md = require('md-directory')
 * var contents = md.parseSync('./post.md')
 **/
module.exports.parseSync = function parseSync(filename, opts) {
  opts = defaults(opts, mdOptions);
  var transforms = [opts.frontmatter, parseContent(opts.md)];
  if (!opts.original) transforms.push(removeOriginal);
  if (opts.transform) transforms.push(opts.transform);
  opts.transform = compose(transforms);
  var data = fs.readFileSync(filename, { encoding: opts.encoding });
  return opts.transform(data);
};
