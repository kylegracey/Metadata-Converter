var fs = require('fs');
var fileName = './convertcsv.json';
var file = require(fileName);
var settings = require('./settings.json');

var KeywordStr = "";

// Gets a specific setting by it's name
function getSetting(key){
  var setting;
  settings.forEach(function(elm){
    var output = elm[key];
    setting = output;
  });
  return setting;
}

//Static Settings
var Archived = "0";
var Copyright = "";
var JobID = "";
var PlatformRights = "";
var Market = "North America";
var AssetStatus = "Active";

//Values to search for
var pGroupWords = getSetting("Product Groups");
console.log(pGroupWords);
var productWords = getSetting("Product");
var personWords = getSetting("Person");
var genderWords = getSetting("Gender");
var campaignWords = getSetting("Campaign");
var sportWords = getSetting("Sport");
var numberOfPeopleWords = getSetting("Number of People");
var marksWords = getSetting("Marks");

file.forEach(function(elm){
  // Keyword string to array temporarily
  var KeywordArr = elm.Keywords.split(', ');

  // Search through Keywords for terms that should be under a 'Group' and return the group(s) the asset should be tagged with.
  function groupSearch(groups){
    var groupHolder = [];

    //for (var key in )

    groups.forEach(function(group){
      var groupName = group[0];
      var groupArr = group[1];
      var hasKeyword = 0;

      groupArr.forEach(function(keyword){
        if(elm.Keywords.search(keyword) !== -1){
          hasKeyword = 1;
        }
      });

      if(hasKeyword === 1) {
        groupHolder.push(groupName);
      }

    });

    return groupHolder.join(',');

  }

  //Search for words within keywords
  function wordSearch(terms) {
    var categoryHolder = [];
    var categoryTerms = terms;

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
  var ProductGroups = groupSearch(pGroupWords);

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
  elm.Product = wordSearch(productWords);
  elm.Person = wordSearch(personWords);
  elm.Gender = wordSearch(genderWords);
  elm["Number of People"] = wordSearch(numberOfPeopleWords);
  elm["Job ID"] = JobID;
  elm.Year = elm.Created.substring(0,4);
  elm["Platform Rights"] = PlatformRights;
  elm.Campaign = wordSearch(campaignWords);
  elm.Sport = wordSearch(sportWords);
  elm.Market = Market;
  elm["Team Marks"] = wordSearch(marksWords);
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
  console.log('Success. Writing to ' + fileName);
});
