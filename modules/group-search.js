var getSetting = require('./get-setting');

//Values to search for
var pGroupWords = getSetting("Product Groups");

// Search through Keywords for terms that should be under a 'Group' and return the group(s) the asset should be tagged with.
module.exports = function groupSearch(elmKeys){
  let groupHolder = [];
  let groups = pGroupWords;
  //Loop through each key in the object
  for (key in groups) {
    const groupName = key;
    const groupArr = groups[key];
    var hasKeyword = 0;
    //Loop through each value of the key's array

    groupArr.forEach(function(keyword){
      //Compare the value to see if it exists in elm.Keywords
      if(elmKeys.search(keyword) !== -1){
        hasKeyword = 1;
      }
    });

    if(hasKeyword === 1) {
      groupHolder.push(groupName);
    }

  }
  return groupHolder.join(',');
}
