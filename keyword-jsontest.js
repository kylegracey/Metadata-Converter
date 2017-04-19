var fs = require('fs');
var fileName = './convertcsv.json';
var file = require(fileName);

var settings = require('./settings.json');

var KeywordStr = "";

function getSetting(key){
  console.log("Key is " + key);
  var setting;
  settings.forEach(function(elm){
    var output = elm[key];
    setting = output;
  });
  return setting;
}

var logout = getSetting("Product");

console.log(logout);
