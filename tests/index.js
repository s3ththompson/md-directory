const path = require('path');
const test = require('tape');
const browserify = require('browserify');
const _eval = require('eval');
const md = require('../');

test('async: convert dir', function(t) {
  md.parseDir(path.join(__dirname, 'files'), function(err, contents) {
    t.notOk(err);
    t.ok(contents);
    t.equal(typeof contents, 'object');
    t.equal(Object.keys(contents).length, 3);
    t.equal(contents['a.md'].data.title, 'foo');
    t.equal(contents['a.md'].content, '<p>bar1</p>\n');
    t.end();
  });
});

test('sync: convert dir', function(t) {
  var contents = md.parseDirSync(path.join(__dirname, 'files'));
  t.ok(contents);
  t.equal(typeof contents, 'object');
  t.equal(Object.keys(contents).length, 3);
  t.equal(contents['a.md'].data.title, 'foo');
  t.equal(contents['a.md'].content, '<p>bar1</p>\n');
  t.end();
});

test('async: custom filter', function(t) {
  md.parseDir(
    path.join(__dirname, 'files'),
    {
      filter: '**/*.markdown'
    },
    function(err, contents) {
      t.notOk(err);
      t.ok(contents);
      t.equal(typeof contents, 'object');
      t.equal(Object.keys(contents).length, 2);
      t.end();
    }
  );
});

test('sync: custom filter', function(t) {
  var contents = md.parseDirSync(path.join(__dirname, 'files'), {
    filter: '**/*.markdown'
  });
  t.ok(contents);
  t.equal(typeof contents, 'object');
  t.equal(Object.keys(contents).length, 2);
  t.end();
});

test('async: custom transform', function(t) {
  md.parseDir(
    path.join(__dirname, 'files'),
    {
      transform: function(contents) {
        contents.custom = 'baz';
        return contents;
      }
    },
    function(err, contents) {
      t.notOk(err);
      t.ok(contents);
      console.log(contents);
      t.equal(contents['a.md'].custom, 'baz');
      t.end();
    }
  );
});

test('sync: custom transform', function(t) {
  var contents = md.parseDirSync(path.join(__dirname, 'files'), {
    transform: function(contents) {
      contents.custom = 'baz';
      return contents;
    }
  });
  t.ok(contents);
  t.equal(typeof contents, 'object');
  t.equal(contents['a.md'].custom, 'baz');
  t.end();
});

test('async: convert file', function(t) {
  md.parse(path.join(__dirname, 'files', 'a.md'), function(err, contents) {
    t.notOk(err);
    t.ok(contents);
    t.equal(contents.data.title, 'foo');
    t.equal(contents.content, '<p>bar1</p>\n');
    t.end();
  });
});

test('sync: convert file', function(t) {
  var contents = md.parseSync(path.join(__dirname, 'files', 'a.md'));
  t.ok(contents);
  t.equal(contents.data.title, 'foo');
  t.equal(contents.content, '<p>bar1</p>\n');
  t.end();
});

test('transform for the browser', function(t) {
  var b = browserify(path.join(__dirname, 'source.js'));
  b.on('error', t.notOk);
  b.transform(require('../transform'));
  b.bundle(function(err, buf) {
    t.notOk(err);
    t.ok(buf);
    var bundle = buf.toString('utf8');
    t.notEqual(bundle.indexOf('hello world'), -1); // from files/c.md
    t.end();
  });
});
