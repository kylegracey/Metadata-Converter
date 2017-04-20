var fs = require('fs');
var fileName = './convertcsv.json';
var file = require(fileName);
var settings = require('./settings.json');

var KeywordStr = "";

//Static Settings
var Archived = "0";
var Copyright = "";
var JobID = "";
var PlatformRights = "";
var Market = "North America";
var AssetStatus = "Active";

// Gets a specific setting by it's name
function getSetting(key){
  var setting;
  settings.forEach(function(elm){
    var output = elm[key];
    setting = output;
  });
  return setting;
}

//Values to search for
var pGroupWords = getSetting("Product Groups");


file.forEach(function(elm){
  // Keyword string to array temporarily
  var KeywordArr = elm.Keywords.split(', ');
  // Search through Keywords for terms that should be under a 'Group' and return the group(s) the asset should be tagged with.
  function groupSearch(){
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
        if(elm.Keywords.search(keyword) !== -1){
          hasKeyword = 1;
        }
      });

      if(hasKeyword === 1) {
        groupHolder.push(groupName);
      }

    }
    return groupHolder.join(',');
  }

  //Search for words within keywords
  function wordSearch(key) {
    var categoryHolder = [];
    var categoryTerms = getSetting(key);

    //Loop through each keyword and seach for each value in KeywordArr
    categoryTerms.forEach(function(keyword){
      var hasKeyword = elm.Keywords.search(keyword);
      if (hasKeyword !== -1) {
        categoryHolder.push(keyword);

        //Now remove from KeywordArr
        var keyIndex = KeywordArr.indexOf(keyword);
        KeywordArr.splice(keyIndex, 1);
      };
    });

    // Convert Keyword array back to string.
    KeywordStr = KeywordArr.join(',');

    //Convert final array to comma-separated string and return.
    return categoryHolder.join(',');

  }

  // Trim any extension off the file name or if there isn't an extension, return the current asset name.
  function trimExtension() {
    if (elm.FileName != null){
      var fName = elm.FileName;
      return fName.replace(/\.[^/.]+$/, "");
    } else {
      return elm["Asset Name"];
    }
  }

  // Take date, remove time, reformat if needed and return proper date.
  function formatDate() {
    if (elm.CreateDate != null){
      var rawDate = elm.CreateDate.substring(0, 10);
      rawDate = rawDate.split(':').join('-');
      return rawDate;
    } else {
      return elm.Created;
    }
  }

  //Setup Keys In order of when they should run
    // Run First (No removing words from Keywords)
  var ProductGroups = groupSearch();


  //Write to Object Keys in order that they should appear
  elm["Asset Name"] = trimExtension();
  elm["Asset Description"] = elm.Description;
  elm.BrandSubbrand = getSetting("BrandSubBrand");
  elm.Created = formatDate();
  elm.Copyright = Copyright;
  elm.Tags = KeywordStr;
  elm["Path to Assets"] = elm.SourceFile;
  elm.Archived = Archived;
  elm["New Filename"] = elm.FileName;
  elm.Group = getSetting("Group");
  elm["Client Team"] = getSetting("Client Team");
  elm["Product Group"] = ProductGroups;
  elm.Product = wordSearch("Product");
  elm.Person = wordSearch("Person");
  elm.Gender = wordSearch("Gender");
  elm["Number of People"] = wordSearch("Number of People");
  elm["Job ID"] = JobID;
  elm.Year = elm.Created.substring(0,4);
  elm["Platform Rights"] = PlatformRights;
  elm.Campaign = wordSearch("Campaign");
  elm.Sport = wordSearch("Sport");
  elm.Market = Market;
  elm["Team Marks"] = wordSearch("Marks");
  elm["Asset Status"] = AssetStatus;


  // Cleanup Non-needed Keys
  delete elm.SourceFile;
  delete elm.CreateDate;
  delete elm.Keywords;
  delete elm.Description;
  delete elm.FileName;

});

fs.writeFile('output.json', JSON.stringify(file), function (err) {
  if (err) return console.log(err);
  console.log('Success. Writing to output.json');
});
