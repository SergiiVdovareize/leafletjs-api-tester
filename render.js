/* global phantom */

var page = require('webpage').create();
var args = require('system').args.slice(1);
var fs = require('fs');
var md5 = require('crypto-js/md5');

var baseUrl = 'file:///' + fs.workingDirectory + '/webapp/index.html';
var baseMapFolder = 'maps';
var nonUrlParams = ['size'];

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

function parseParams () {
  var paramsArray = args.filter(function (arg) {
    return arg.indexOf('=') !== -1;
  });

  var parsedParams = {};
  paramsArray.forEach(function (paramString) {
    var keyValue = paramString.split('=');
    parsedParams[keyValue[0]] = keyValue[1];
  });

  return parsedParams;
}

function composeUrlParams (params) {
  var stringParams = Object.keys(params)
    .filter(function (param) {
      return nonUrlParams.indexOf(param) === -1;
    }).map(function (param) {
      return param + '=' + params[param];
    });

  return stringParams.join('&');
}

function encodeParams (params) {
  var sortedKeys = Object.keys(params).sort(function (p1, p2) {
    if (p1 < p2) {
      return -1;
    }
    if (p2 < p1) {
      return 1;
    }
    return 0;
  });

  var encodingString = '';
  sortedKeys.forEach(function (key) {
    encodingString += key + params[key];
  });

  return md5(encodingString);
}

function setViewportSize (parsedSize) {
  var width = 1000;
  var height = 1000;

  if (parsedSize) {
    var size = parsedSize.split(/,|x/);
    if (!isNaN(size[0]) && !isNaN(size[1])) {
      width = size[0];
      height = size[1];
    }
  }

  page.viewportSize = {
    width: width,
    height: height
  };
}

function render (url, paramsHash) {
  var imageTarget = baseMapFolder + '/' + paramsHash + '.png';
  // eslint-disable-next-line n/no-deprecated-api
  if (fs.exists(imageTarget)) {
    console.log('map already exists: ', imageTarget);
    phantom.exit();
    return;
  }

  page.open(url, function (status) {
    if (status !== 'success') {
      console.log('unable to load the address', status);
      phantom.exit();
    } else {
      window.setTimeout(function () {
        console.log('render map:', imageTarget);
        page.render(imageTarget);
        phantom.exit();
      }, 1000);
    }
  });
}

var parsedParams = parseParams();
var paramsHash = encodeParams(parsedParams);
var urlParams = composeUrlParams(parsedParams);
var url = urlParams.length > 0 ? baseUrl + '?' + urlParams : baseUrl;
setViewportSize(parsedParams.size);
render(url, paramsHash);

// phantomjs render.js target=49.566115,25.576170 position=49.551971,25.59374 pilot=49.554738,25.607933 zoom=10 size=1000,1000
