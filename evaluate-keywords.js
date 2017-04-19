var fs = require('fs');
var fileName = './convertcsv.json';
var file = require(fileName);

var AllKeywords = [];

file.forEach(function(elm){
  // For each file, split the Keywords line into an array
  var KeywordArr = elm.Keywords.split(', ');

  // Loop through that array and compare each keyword with AllKeywords to see if it already exists
  KeywordArr.forEach(function(keyword){
    var hasKeyword = AllKeywords.indexOf(keyword);
    if (hasKeyword == -1) {
      AllKeywords.push(keyword);
    };
  });
});

console.log(AllKeywords);
