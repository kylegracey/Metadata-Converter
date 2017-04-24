var getSetting = require('./get-setting');

//Search for words within keywords
module.exports = function wordSearch(key, obj) {
  var categoryHolder = [];
  var categoryTerms = getSetting(key);

  //Loop through each keyword and seach for each value in KeywordArr
  categoryTerms.forEach(function(keyword){
    var hasKeyword = obj.Keywords.search(keyword);
    if (hasKeyword !== -1) {
      categoryHolder.push(keyword);

      //Now remove from KeywordArr
      var keyIndex = KeywordArr.indexOf(keyword);
      KeywordArr.splice(keyIndex, 1);
    };
  });

  //Convert final array to comma-separated string and return.
  return categoryHolder.join(',');

}
