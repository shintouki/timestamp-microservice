var express = require('express');
var pattern = require('url-pattern');
var moment = require('moment');

var app = express();

var port = process.env.PORT || 8080;

app.use("/", express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  
});

var monthsReg = "(" + ["jan", "feb", "mar", "apr", "may", "jun",
              "jul", "aug", "sep", "sept", "oct", "nov",
              "dec", "january", "february", "march", "april",
              "may", "june", "july", "august", "september",
              "october", "november", "december"
             ].join("|") + "|(?:[1-9]|1[0-2]))";

var reStr = "^/" + monthsReg + "(?:%20|-)([1-2]?[1-9]|3[0-1])(?:%20|-)(\\d{1,4})$";

// console.log(reStr);

var reg = new RegExp(reStr, "i");
// console.log(reg.exec('/dec%205%2015'));


var monthDictionary = {"1": "January", "2": "February", "3": "March", "4": "April",
                       "5": "May", "6": "June", "7": "July", "8": "August", "9": "September",
                       "10": "October", "11": "November", "12": "December",
                       "jan": "January", "feb": "February", "mar": "March", "apr": "April",
                       "jun": "June", "jul": "July", "aug": "August", "sept": "September",
                       "oct": "October", "nov": "November", "dec": "December",
                       "january": "January", "february": "February", "march": "March", "april": "April",
                       "may": "May", "june": "June", "july": "July", "august": "August", "september": "September",
                       "october": "October", "november": "November", "december": "December",
                       "January": "January", "February": "February", "March": "March", "April": "April",
                       "May": "May", "June": "June", "July": "July", "August": "August", "September": "September",
                       "October": "October", "November": "November", "December": "December"
                      };

var monthToNum = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
                  "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12
                 }

app.get(reg, function(req, res) {
  
  var url_ = req.url;
  var match = reg.exec(url_);
  
  var month = match[1];
  var day = match[2];
  var year = match[3];
  
  year = parseInt(year);
  console.log(year);
  if (year < 10) {
    year = "200" + year;
    console.log("a");
  }
  else if (year < 50) {
    year = "20" + year;
    console.log("b");
  }
  else if (year < 100) {
    year = "19" + year;
    console.log("c");
  }
  
  console.log(month);
  console.log(day);
  console.log(year);
  
  var monthNum;
  if (isNaN(month)) {
    monthNum = monthToNum[month.toLowerCase().substr(0,3)];
  }
  else {
    monthNum = month;
  }
  
  var dateObject = new Date(year, monthNum-1, day);
  console.log("date:" + dateObject);
  
  var naturalDate = monthDictionary[month] + " " + day + ", " + year;
  var unixDate = dateObject.getTime() / 1000;
  
  console.log(naturalDate);
  console.log(unixDate);
  
  var output = {
    "unix": unixDate,
    "natural": naturalDate
  }
  
  res.send(output);
});

var unixRegex = new RegExp("^/\\d+$");

app.get(unixRegex, function (req, res) {
  var url_ = req.url;
  console.log(url_);
  var unixDate = url_.substr(1);
  var unformattedNaturalDate = moment.unix(unixDate).format("MM/DD/YYYY");
  var month = unformattedNaturalDate.substr(0,2);
  var day = unformattedNaturalDate.substr(3,2);
  var year = unformattedNaturalDate.substr(6);
  
  var naturalDate = monthDictionary[month] + " " + day + ", " + year;
  
  var output = {
    "unix": unixDate,
    "natural": naturalDate
  };
  
  res.send(output);
  
});

app.get('*', function(req, res){
  var output = {
    "unix": null,
    "natural": null
  }
  res.send(output);
});

app.listen(port, function () {
  console.log('App is running on port ' + port);
});