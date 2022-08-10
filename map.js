const page = require('webpage').create();
const args = require('system').args.slice(1);

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.viewportSize = {
  width: 2000,
  height: 2000
}

const baseUrl = 'file:///G:/work/leafletjs-api-tester/webapp/index.html'

function gerParams() {
  const paramsArray = args.filter(function(arg) {
    return arg.indexOf('=') !== -1
  });
  return paramsArray.length > 0 ? paramsArray.join('&') : ''
}

function render(url) {
  page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!', status);
        phantom.exit();
    } else {
        window.setTimeout(function () {
            page.render('image.png', { quality: '30' });
            phantom.exit();
        }, 1000);
    }
  });
}


const url = baseUrl + '?' + gerParams()
render(url)

// phantomjs map.js target=49.566115,25.576170 position=49.551971,25.59374 pilot=49.554738,25.607933 zoom=10