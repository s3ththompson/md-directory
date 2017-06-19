const path = require('path');
const through = require('through2');
const staticModule = require('static-module');
const md = require('.');

module.exports = function mdDirectoryTransform(filename) {
  if (/\.json$/.test(filename)) return through();

  var basedir = path.dirname(filename);
  var vars = {
    __filename: filename,
    __dirname: basedir
  };

  var sm = staticModule(
    {
      'md-directory': {
        parseDir: function(dir, opts, cb) {
          if (typeof opts === 'function') {
            cb = opts;
            opts = {};
          }
          dir = path.isAbsolute(dir) ? dir : path.resolve(dir);
          var stream = through();
          stream.push('process.nextTick(function(){(' + cb + ')(null,');
          stream.push(JSON.stringify(md.parseDirSync(dir, opts)));
          stream.push(')})');
          stream.push(null);
          return stream;
        },
        parseDirSync: function(dir, opts) {
          dir = path.isAbsolute(dir) ? dir : path.resolve(dir);
          var stream = through();
          stream.push(JSON.stringify(md.parseDirSync(dir, opts)));
          stream.push(null);
          return stream;
        },
        parse: function(filename, opts, cb) {
          if (typeof opts === 'function') {
            cb = opts;
            opts = {};
          }
          filename = path.isAbsolute(filename)
            ? filename
            : path.resolve(filename);
          var stream = through();
          stream.push('process.nextTick(function(){(' + cb + ')(null,');
          stream.push(JSON.stringify(md.parseSync(filename, opts)));
          stream.push(')})');
          stream.push(null);
          return stream;
        },
        parseSync: function(filename, opts) {
          filename = path.isAbsolute(filename)
            ? filename
            : path.resolve(filename);
          var stream = through();
          stream.push(JSON.stringify(md.parseSync(filename, opts)));
          stream.push(null);
          return stream;
        }
      }
    },
    { vars: vars, varModules: { path: path } }
  );

  return sm;
};
