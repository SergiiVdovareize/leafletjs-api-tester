const page = require('webpage').create();
const system = require('system')

// const url = 'https://google.com'
// const url = 'http://localhost:58247/webapp/index.html'
const params = '?target=49.566115,25.576170&position=49.551971,25.593743&pilot=49.554738,25.607933'
const url = 'file:///G:/work/leafletjs-api-tester/webapp/index.html' + params

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

page.viewportSize = {
  width: 2000,
  height: 2000
}

// page.open(url, function() {
//   setTimeout(function () {
//     page.render('image.png');
//     phantom.exit();
//   }, 1000)
// });

// const script1 = "function(){window.document.getElementById('test').innerText = window.testFunc}"

page.open(url, function (status) {
  if (status !== 'success') {
      console.log('Unable to load the address!', status);
      phantom.exit();
  } else {
      // page.evaluateJavaScript(script1);

      window.setTimeout(function () {
          console.log('do render');
          page.render('image.png');
          phantom.exit();
      }, 1000); // Change timeout as required to allow sufficient time 
  }
});