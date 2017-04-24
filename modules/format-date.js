// Take date, remove time, reformat if needed and return proper date.
module.exports = function formatDate(obj) {
  if (obj.CreateDate != null){
    var rawDate = obj.CreateDate.substring(0, 10);
    rawDate = rawDate.split(':').join('-');
    return rawDate;
  } else {
    return obj.Created;
  }
}
