try {
  var Spooky = require('spooky');
} catch (e) {
  var Spooky = require('../lib/spooky');
}
var fs = require('fs');
var mkdirp = require('mkdirp');
var memberships = [
      // {
      //     name: "Rick Aguayo",
      //     number: "922523019"
      // }
      // {
      //     name: "Thien Pham",
      //     number: "11228896"
      // }
      // {
      //     name: "Gene Huh",
      //     number: "2006462133"
      // }
      {
          name: "Gene Cherng",
          number: "919883990"
      }
  ];
  
var spooky = new Spooky({
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'error',
    verbose: true,
    waitTimeout: 25000,
    // options: {
    //  clientScripts: ['../../bower_components/jquery/dist/jquery.min.js']
    // }

  }
}, function (err) {
  if (err) {
    var e = new Error('Failed to initialize SpookyJS');
    e.details = err;
    throw e;
  }

  var yearCounter = -1;
  var membershipsCounter = 0;
  var year = "";
  
  var startYear = 2004;
  var endYear = 2015;
  var url = "http://tennislink.usta.com/leagues/Main/StatsAndStandings.aspx?t=T-0&par1=l1WX920Ajqxfd1OD7kXBOg%3d%3d&e=1#&&s=8||0||";
  var localData;
  var championData;
  var tournyData;
  var matches;

  spooky.start(url, function() {

  });
  //spooky.page.injectJs('./jquery.min.js');
  spooky.userAgent('Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)');

  spooky.then([{
    memberships: memberships,
    membershipsCounter: membershipsCounter,
    startYear: startYear,
    endYear: endYear,
    yearCounter: yearCounter,
    year: year,
    url: url
  }, function () {
    
    var _url = url + memberships[0].number + "||";
    this.repeat(endYear - startYear + 1, function() {
            yearCounter++;
            this.clear();
            if (yearCounter == endYear - startYear + 1) {
              yearCounter = 0;
              membershipsCounter++;
            }
            window.year = (startYear + yearCounter).toString();
            this.thenOpen(_url + window.year, function() {
              console.log(_url + window.year);
              
              this.waitForSelector('#ctl00_mainContent_tblIndLeagueResult', function() {
                window.localData = this.evaluate(function() {
                  var leagues = [];
                  var leagueTitle;
                  var counter = 0;

                  //Local League Results
                  $('#ctl00_mainContent_tblIndLeagueResult > tbody:nth-child(n+1)').each(function() {
                      
                      $(this).find('> tr').each(function(i) {
                          var $tds = $(this).find('> td');
                          
                          if (i === 1 && $tds.length === 3) {
                              leagueTitle = {
                                  type: "Local League",
                                  section: $.trim($tds.eq(0).text()),
                                  district: $.trim($tds.eq(1).text()),
                                  name: $.trim($tds.eq(2).text().replace(/\s+/g, ' ')),
                                  flight: null,
                                  round: null
                              };

                              counter++;

                          }

                          if (i > 2 && $tds.length === 7) {
                              var winner = "";
                              var loser = "";

                              if ($tds.eq(2).find('table tr').length === 2) {
                                  var $wname = $tds.eq(2).find('a');
                                  winner = $.trim($wname.eq(0).text()) + ', ' + $.trim($wname.eq(1).text());
                              } else {
                                  winner = $.trim($tds.eq(2).text());
                              }

                              if ($tds.eq(3).find('table tr').length === 2) {
                                  var $lname = $tds.eq(3).find('a');
                                  loser = $.trim($lname.eq(0).text()) + ', ' + $.trim($lname.eq(1).text());
                              } else {
                                  loser = $.trim($tds.eq(3).text());
                              }

                              var league = $.extend({}, leagueTitle);
                              league.matchId = $.trim($tds.eq(0).text());
                              league.matchDate = $.trim($tds.eq(1).text());
                              league.winner = winner;
                              league.loser = loser;
                              league.score = $.trim($tds.eq(4).text());
                              league.matchType = $.trim($tds.eq(5).text());
                              league.level = $.trim($tds.eq(6).text());

                              leagues.push(league);

                          }

                      });

                  });
                  return leagues;
                });

                //this.echo(localData);

                this.then(function() {
                  window.championData = this.evaluate(function() {
        
                    var championships = [];
                    var champTitle;
                    var counter = 0;

                    //Championship Results
                    $('#ctl00_mainContent_pnlIndividualRecord .panes:nth-of-type(2)').find('table:nth-child(n+2)').each(function(i, val) {
                        
                        $(this).find('tr').each(function(i) {
                            var $tds = $(this).find('td.bottom');
                            var tdLength = $tds.length;

                            if ($(this).find('td.subhead:first-child').text().indexOf('Championship') > -1) {
                                $tds = $(this).next().find('td.bottom');

                                champTitle = {
                                    type: "Championship",
                                    section: null,
                                    district: null,
                                    name: $.trim($tds.eq(0).text().replace(/\s+/g, ' ')),
                                    level: $.trim($tds.eq(2).text().replace(/\s+/g, ' ')), //Div/NTRP/Gender field of championships table
                                    flight: $.trim($tds.eq(1).text().replace(/\s+/g, ' ')), //Level field of championships table
                                    round: null
                                };

                                counter++;
                            }

                            if (tdLength === 6) {
                                var winner = "";
                                var loser = "";
                                var $wname = $tds.eq(2).find('a');
                                var $lname = $tds.eq(3).find('a');

                                if ($tds.eq(5).text().indexOf("Doubles") >= 0) {


                                    winner = $.trim($wname.eq(0).text()) + ', ' + $.trim($wname.eq(1).text());
                                    loser = $.trim($lname.eq(0).text()) + ', ' + $.trim($lname.eq(1).text());
                                } else {
                                    winner = $.trim($wname.eq(0).text());
                                    loser = $.trim($lname.eq(0).text());
                                }

                                var champ = $.extend({}, champTitle);
                                champ.matchId = $.trim($tds.eq(0).text());
                                champ.matchDate = $.trim($tds.eq(1).text());
                                champ.winner = winner;
                                champ.loser = loser;
                                champ.score = $.trim($tds.eq(4).text());
                                champ.matchType = $.trim($tds.eq(5).text());

                                championships.push(champ);
                            }
                        });

                    });
                    return championships;
                  });

                  //casper.echo(championData);

                  this.then(function() {
                    window.tournyData = this.evaluate(function() {
        
                      var tournies = [];

                      $('#ctl00_mainContent_tbodyTourDataForIndividual').find('tr:nth-child(n+3)').each(function(i, val) {
                          var $tds = $(this).find('td.bottom');
                          var tdLength = $tds.length;

                          if (tdLength === 7) {
                              var winner = "";
                              var loser = "";

                              if ($tds.eq(2).find('a:nth-of-type(2)').is(":empty")) {
                                  
                                  winner = $.trim($tds.eq(2).text());
                                  
                              } else {
                                  var $wname = $tds.eq(2).find('a');
                                  winner = $.trim($wname.eq(0).text()) + ', ' + $.trim($wname.eq(1).text());
                              }

                              if ($tds.eq(3).find('a:nth-of-type(2)').is(":empty")) {
                                  loser = $.trim($tds.eq(3).text());
                              } else {
                                  
                                  var $lname = $tds.eq(3).find('a');
                                  loser = $.trim($lname.eq(0).text()) + ', ' + $.trim($lname.eq(1).text());
                              }

                              tournies.push({
                                  district: null,
                                  flight: null,
                                  level: $.trim($tds.eq(6).text().replace(/\s+/g, ' ')),
                                  loser: loser,
                                  matchDate: $.trim($tds.eq(1).text().replace(/\s+/g, ' ')),
                                  matchId: null,
                                  matchType: null,
                                  name: $.trim($tds.eq(0).text().replace(/\s+/g, ' ')),
                                  round: $.trim($tds.eq(5).text().replace(/\s+/g, ' ')),
                                  section: null,
                                  score: $.trim($tds.eq(4).text().replace(/\s+/g, ' ')),
                                  type: "Tournament",
                                  winner: winner,
                              });

                          }

                      });
                      return tournies;
                    });

                    //casper.echo(tournyData);

                    this.then(function () {
                      window.matches = JSON.stringify(window.localData.concat(window.championData, window.tournyData));

                      if(window.matches !== "[]") {
                        this.then(function() {
                          window.fileName = memberships[0].name.split(/\s+/).sort().join('') + memberships[0].number + "_" + window.year;
                          window.directory = memberships[0].name.split(/\s+/).sort().join('');

                          this.emit('file-finished', {matches: window.matches, fileName: window.fileName, directory: window.directory});
                          //fs.makeDirectory(path);
                          //console.log(window.matches);
                          
                        });
                      }
                    });

                  });

                });

              });
              
            });

          
          });

  }]);

   

  spooky.run();
});

spooky.on('file-finished', function (data) {

    if (!fs.existsSync('./src/server/data/' + data.directory)){
        fs.mkdirSync('./src/server/data/' + data.directory);

    }
    //fs.writeFile('./src/server/data/' + data.directory + '/' + data.fileName + ".json", data.matches);
    fs.writeFile('./src/server/data/' + data.directory + '/' + data.fileName + ".json", data.matches, function (err) {
        console.log("file saved:" + data.fileName + ".json");
      });
}); 

spooky.on('console', function (line) {
    console.log(line);
});
