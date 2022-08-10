const page = require('webpage').create();
const args = require('system').args.slice(1);
const fs = require('fs');
// const hash = require('object-hash');
const md5 = require('crypto-js/md5');

const baseUrl = 'file:///' + fs.workingDirectory + '/webapp/index.html'
const baseMapFolder = 'maps'
const nonUrlParams = ['size']

function parseParams() {
  const paramsArray = args.filter(function(arg) {
    return arg.indexOf('=') !== -1
  });

  const parsedParams = {}
  paramsArray.forEach(function(paramString) {
    const keyValue = paramString.split('=')
    parsedParams[keyValue[0]] = keyValue[1]
  })

  return parsedParams
}

function composeUrlParams(params) {
  const stringParams = Object.keys(params)
    .filter(function(param) {
      return nonUrlParams.indexOf(param) === -1
    }).map(function(param) {
      return param + '=' + params[param]
    })

  return stringParams.join('&')
}

function encodeParams(params) {
  const sortedKeys = Object.keys(params).sort(function(p1, p2) {
    if (p1 < p2) {
      return -1;
    }
    if (p2 < p1) {
        return 1;
    }
    return 0;
  })

  var encodingString = ''
  sortedKeys.forEach(function(key) {
    encodingString += key + params[key]
  })
  
  return md5(encodingString)
}

function setViewportSize(parsedSize) {
  var width = 1000;
  var height = 1000;

  const size = parsedSize.split(/,|x/)
  if (!isNaN(size[0]) && !isNaN(size[1])) {
    width = size[0]
    height = size[1]
  }
  
  page.viewportSize = {
    width: width,
    height: height,
  }
}

function render(url, paramsHash) {
  page.open(url, function (status) {
    if (status !== 'success') {
        console.log('unable to load the address', status);
        phantom.exit();
    } else {
      const imageTarget = baseMapFolder + '/' + paramsHash + '.png'
      
      if (fs.exists(imageTarget)) {
        console.log('map already exists: ', imageTarget);
        phantom.exit();
      } else {
        window.setTimeout(function () {
          console.log('render map:', imageTarget);
          page.render(imageTarget);
          phantom.exit();
        }, 1000);
      }
    }
  });
}

const parsedParams = parseParams()
const paramsHash = encodeParams(parsedParams)
// console.log(paramsHash)
const urlParams = composeUrlParams(parsedParams)
const url = urlParams.length > 0 ? baseUrl + '?' + urlParams : baseUrl
setViewportSize(parsedParams.size)
render(url, paramsHash)

// phantomjs map.js target=49.566115,25.576170 position=49.551971,25.59374 pilot=49.554738,25.607933 zoom=10 size=1000,1000