var path = require('path');
var md = require('md-directory');
module.exports = md.parseDirSync(path.join(__dirname, 'files'));
