var fs = require('fs');
var fileName = './convertcsv.json';
var file = require(fileName);
var settings = require('./settings.json');
var getSetting = require('./modules/get-setting')
var groupSearch = require('./modules/group-search');
//var wordSearch = require('./modules/word-search');


var KeywordArr = [];

//Static Settings
var Archived = "0";
var Copyright = "";
var JobID = "";
var PlatformRights = "";
var Market = "North America";
var AssetStatus = "";

//Search for words within keywords
function wordSearch(key, obj) {
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

// Trim any extension off the file name or if there isn't an extension, return the current asset name.
function trimExtension(obj) {
  if (obj.FileName != null){
    var fName = obj.FileName;
    return fName.replace(/\.[^/.]+$/, "");
  } else {
    return obj["Asset Name"];
  }
}

// Take date, remove time, reformat if needed and return proper date.
function formatDate(obj) {
  if (obj.CreateDate != null){
    var rawDate = obj.CreateDate.substring(0, 10);
    rawDate = rawDate.split(':').join('-');
    return rawDate;
  } else {
    return obj.Created;
  }
}

file.forEach(function(elm){
  // Keyword string to array temporarily
  KeywordArr = elm.Keywords.split(', ');

  //Setup Keys In order of when they should run
    // Run First (before removing words from Keywords with wordSearch function)
  const ProductGroups = groupSearch(elm.Keywords);
    // Run Second (removes words from tags)
  const ProductWords = wordSearch("Product", elm);
  const PersonWords = wordSearch("Person", elm);
  const GenderWords = wordSearch("Gender", elm);
  const CampaignWords = wordSearch("Campaign", elm);
  const SportWords = wordSearch("Sport", elm);
  const NumPeopleWords = wordSearch("Number of People", elm);
  const MarksWords = wordSearch("Marks", elm);

  //Write to Object Keys in order that they should appear
  elm["Asset Name"] = trimExtension(elm);
  elm["Asset Description"] = elm.Description;
  elm.BrandSubbrand = getSetting("BrandSubBrand");
  elm.Created = formatDate(elm);
  elm.Copyright = Copyright;
  elm.Tags = KeywordArr.join(',');
  elm["Path to Assets"] = elm.SourceFile;
  elm.Archived = Archived;
  elm["New Filename"] = elm.FileName;
  elm.Group = getSetting("Group");
  elm["Client Team"] = getSetting("Client Team");
  elm["Product Group"] = ProductGroups;
  elm.Product = ProductWords;
  elm.Person = PersonWords;
  elm.Gender = GenderWords;
  elm["Number of People"] = NumPeopleWords;
  elm["Job ID"] = JobID;
  elm.Year = elm.Created.substring(0,4);
  elm["Platform Rights"] = PlatformRights;
  elm.Campaign = CampaignWords;
  elm.Sport = SportWords;
  elm.Market = Market;
  elm["Team Marks"] = MarksWords;
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
