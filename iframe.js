var nodify = 'phantomjs-nodify/nodify.js';
phantom.injectJs(nodify);

nodify.run(
  function() {

    var page = require('webpage').create();
    var fs = require("fs");
    var system = require('system');
    var url = require('url');

    var h3 = '-------------------------------';
    var h4 = 'h4. ';
    // Use to force a timeout on the page
    var timeout = 6000;
    page.lastRequest = new Date();

    page.onLoadStarted = function () {
      //      console.log('\n\n--------------- onLoadStarted \n');
      //      console.log('Start loading...');
    };

    page.onLoadFinished = function (status) {
      //      console.log('\n\n--------------- onLoadFinished \n', status);
      // console.log('Loading finished.');
    };

    page.onConsoleMessage = function(msg) {
      // console.log(msg);
    };

    page.onError = function (msg, trace) {
      //  console.log(msg);
    };

    page.onResourceRequested = function (request) {
      var parsed = url.parse(request.url, true, true);
      //      console.log(parsed);
      // We need to see which of the tags is being called
      if(parsed.host.indexOf('bkrtx.com') !== -1) {
        console.log('\n\n', h4, 'onResourceRequests : bkrtx.com', parsed.host, parsed.pathname);
      }

      // Show the site id and the block of parameters
      if(parsed.host.indexOf('bluekai.com') !== -1) {
        console.log('\n\n', h4, 'onResourceRequests : bkrtx.com', parsed.host, parsed.pathname);
        console.log('\n- ', parsed.host, parsed.pathname, '\n{code}\n', parsed.query, '\n{code}');
        //        var phints = parsed.query.phint;
        // for (var i = 0; i < phints; i++) {
        //   console.log(phints[i]);
        // }
      }
    };

    // Find all network requests to the container
    page.onResourceReceived = function (response) {
      page.lastRequest = new Date();
    };

    var uriQueue = [
//      'https://www.shopping.hp.com/webapp/shopping/cart_detail.do?view_cart=checkout',
//      'https://www.shopping.hp.com/webapp/shopping/cart_detail.do?view_cart=checkout&hpanalyticsdev=',
      'http://www.shopping.hp.com/webapp/shopping/cto.do?hpanalyticsdev=',
//      'http://www.shopping.hp.com/en_US/home-office/-/products/Desktops/HP-TouchSmart-All-in-One/A5W91AV?hpanalyticsdev=',
      'http://www.shopping.hp.com/en_US/home-office/-/products/Desktops/HP-TouchSmart-All-in-One/A5W91AV?production',
      //      'http://www.hp.com/?production', // custom hosted
      'http://www.hp.com/?hpanalyticsdev=', // custom hosted
      //      'http://www.nhincuoi.com/hinh-anh-vui-cuoi/anh-hai-huoc-20-06-2012-65251', // coretag
      'http://www.cbssports.com/', // static
      'http://www.zillow.com/homedetails/1925-W-13th-St-Ashtabula-OH-44004/72398383_zpid/',
      'http://wal.sh/bk/tags/tests/100-doTag.html',
      'http://wal.sh/bk/tags/tests/102-noframe.html',
      'http://wal.sh/bk/tags/tests/103-noframe-script-head.html',
      'http://wal.sh/bk/tags/tests/104-frame-script-head.html',
      'http://wal.sh/bk/tags/tests/104-doTag-noIframe.html',
      'http://www.dailymail.co.uk/tvshowbiz/article-2203532/Titanic-James-Cameron-explains-Jack-climb-raft-Rose.html?ito=feeds-newsxml',
      'http://minnesota.cbslocal.com/2012/09/13/mcds-installs-corrected-hmong-billboards/',
      'http://wal.sh/bk/tags/tests/130-mobile.html',
      'http://wal.sh/bk/tags/tests/test-bk-mobile-requirejs.html',
      'http://js.bizographics.com/support/partner.html',
      'http://nnl2000.baseball.cbssports.com/',
      'http://www.dailymail.co.uk/tvshowbiz/article-2203532/Titanic-James-Cameron-explains-Jack-climb-raft-Rose.html?ito=feeds-newsxml', // /js/bk-static.js
      'http://www.shopping.hp.com/en_US/home-office/-/products/Laptops/Laptops',
      'http://www.ebay.com/sch/Greek-/37906/i.html',
      'http://www.zillow.com/',
      'http://www.zillow.com/homes/Houses-in-Jefferson-county-_rb/',
      'http://www.moneysupermarket.com/loans/',
      'http://www.cyclingnews.com/',
      'http://www.gamesradar.com/nhl-13-review/',
      'http://www.cio.com/article/716369/CIOs_Look_Ahead_Millennials_Consumer_Tech_and_the_Future?taxonomyId=3185'
    ];

    // use this from the command line
    var uri = process.argv[2] ? process.argv[2] :  uriQueue[0];

    var openUri = function(uri) {
      console.log('\n- ', uri);
      page.open(
        encodeURI(uri),
        function (status) {
          page.timedout = false;
          if (status !== "success") {
            console.log("Unable to access network");
          } else {
            // console.log("Load success");
            var meta = page.evaluate(
              function() {

                delete BKTAG;
                var scripts=document.getElementsByTagName('script')[0];
                var s=document.createElement('script');
                s.async = true;
                s.src = 'http://tags.bkrtx.com/js/bk-coretag.js';
                scripts.parentNode.insertBefore(s, scripts);
                BKTAG.doTag(2);

                return {
                  'title': document.getElementsByTagName('title')[0].innerHTML,
                  'version': BKTAG.version,
                  'hpversion': BKTAG.hpversion
                };
              });
            if (meta) {
              console.log('\n{code}\n', meta, '\n{code}');
            }
          }
        });
    };

    openUri(uri);

    var intervalPage = setInterval(
      function() {
        if (new Date() - page.lastRequest > timeout) {
          console.log('\n- Run completed: ', new Date());
          page.render('screenshot.png');
          phantom.exit();
        }
      }, 100);

   var intervalQueue = setInterval(
      function() {
        if (new Date() - page.lastRequest > timeout) {
          phantom.exit();
        }
      }, 100);

  });
