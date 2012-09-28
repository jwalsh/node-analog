var fs = require('fs');
var parseUri = require('parseUri');
 var url = require('url');
var Lazy = require('lazy');

var filename = 'data/ps01-access_log-20120917';

var regexAccessLog = /^([\d.]+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(.+?)" (\d{3}) (\d+) "([^"]+)" "([^"]+)"/;

Lazy(fs.createReadStream(filename))
  .lines
  .take(1000)
  .map(String)
  .map(
    function(line) {
      // console.log(line);
      var m = line.match(regexAccessLog);
      if (m) {
        var get = m[5].split(' ')[1];
        var referrer = m[8];
        if (get === '/js/bk-static.js' && referrer !== '-') {
          console.log(url.parse(referrer).href);
        }
      }
    });
