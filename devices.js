var wurfl = require('wurfl');

wurfl.loadSync();

var fs = require('fs');
var parseUri = require('parseUri');
 var url = require('url');
var Lazy = require('lazy');

var filename = 'data/ps01-access_log-20120917';

var regexAccessLog = /^([\d.]+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(.+?)" (\d{3}) (\d+) "([^"]+)" "([^"]+)"/;

Lazy(fs.createReadStream(filename))
  .lines
//  .take(1000)
  .map(String)
  .map(
    function(line) {
      // console.log(line);
      var m = line.match(regexAccessLog);
      if (m) {
        var get = m[5].split(' ')[1];
        var referrer = m[8];
        var userAgent = m[9];
        // 'Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; O2 Xda 2s;PPC;240x320; PPC; 240x320)';
        var deviceInfo = wurfl.get(userAgent);
        if (deviceInfo && deviceInfo.product_info) {
          console.log(deviceInfo.id);
        } else {
//           console.log('Error:  ' + userAgent);
        }



      }
    });
