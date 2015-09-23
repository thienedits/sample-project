var firebase = require('firebase');
var fs = require('fs');
var path = require('path');
var ref = new firebase('https://torid-fire-9544.firebaseio.com');
var filePath = "";
var files = "";

module.exports = {
    importMatches: importMatches,
    updateCurrentYear : updateCurrentYear,
    copyUserMatches: copyUserMatches
};

function getYear(str) {
    return str.split('_')[1].match(/\d+/)[0];
}

function importMatches(params) {
  var userFolder = params.username.split(/\s+/).sort().join('');
  filePath = path.join(__dirname, "./data/"+userFolder);
  files = fs.readdirSync(filePath);

  var matches = ref.child('matches').child(params.uid);
  var userMatches = ref.child('user_matches').child(params.uid);
  matches.remove();
  userMatches.remove();

  for (var i in files) {
    
    if (files[i] !== ".DS_Store") {
      var fileLoc = path.join(__dirname, "./data/"+userFolder+"/")+files[i];
      var year = getYear(files[i]);

      (function(year, index) {

        fs.readFile(fileLoc, function (err, data) {

          JSON.parse(data).forEach(function(match) {
            var date = new Date(match.matchDate).getTime();
            if(match.loser.indexOf(params.username) === -1) {
              match.opponent = match.loser;
              match.winloss = "W";
            }

            if(match.winner.indexOf(params.username) === -1) {
              match.opponent = match.winner;
              match.winloss = "L";
            }

            if(match.opponent === ", " || match.opponent === "N/A") {
              match.opponent = "Default";
            }

            if(match.winner.indexOf(",") > -1 ) {
              if (match.matchType === "") {
                match.matchType = "Doubles";
              } 
            } else {
              if (match.matchType === "") {
                match.matchType = "Singles";
              } 
            }
            match.player =  params.username;
            match.playerUID = params.uid;
            match.matchDate = date;

            ref.child('matches').child(params.uid).child(year).push(match);
            userMatches.push(match);
          });
         
        });

      }(year, i));

      
    }

  }

  //copyUserMatches(params);
}

function copyUserMatches (params) {
  var matches = ref.child('matches').child(params.uid);
  var userMatches = ref.child('user_matches').child(params.uid);
  userMatches.remove();

  matches.on("value", function(snapshot) {

    // The callback function will get called twice, once for "fred" and once for "barney"
    snapshot.forEach(function(childSnapshot) {
      // key will be "fred" the first time and "barney" the second time
      var key = childSnapshot.key();
      // childData will be the actual contents of the child

      var childData = childSnapshot.val();

      childSnapshot.forEach(function(match) {
          //console.log(match.val());

          userMatches.push(match.val());
      });
          
    });

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function updateCurrentYear (params) {
  var userFolder = params.username.split(/\s+/).sort().join('');
  var matches = ref.child('matches').child(params.uid);
  filePath = path.join(__dirname, "./data/"+userFolder);
  files = fs.readdirSync(filePath);

  for (var i in files) {

    if (files[i] !== ".DS_Store" && i == files.length - 1) {
      var lastYear = getYear(files[files.length - 1]);
      var lastFileName = files[files.length - 1];
      var fileLoc = path.join(__dirname, "./data/"+userFolder+"/")+lastFileName;
      
      matches.child(lastYear).remove();

      fs.readFile(fileLoc, function(err, data) {

        JSON.parse(data).forEach(function(match) {
            var date = new Date(match.matchDate).getTime();
            match.player = params.username;
            match.playerUID = params.uid;
            match.matchDate = date;
            matches.child(lastYear).push(match);
        });

      });

    }
  } 

}



