require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require("fs");
var moment = require("moment");

var randomMovie = false;
var randomBand = false;
var randomSong = false;
var randomInfo = "";


//get user input

var action = process.argv[2];
var arrInput = (process.argv.slice(3)).join(" ");

// console.log("action " + action);
// console.log("arrInput " + arrInput);



if (action == "movie-this"){
    findMovie(arrInput);
} else if (action == 'concert-this') {
    findBand(arrInput);
} else if (action == 'spotify-this-song') {
     findSong(arrInput);
} else if (action = 'do-what-it-says') {
  doTextInstruct();
}



function findMovie(arrInput) {

if (arrInput == ""){
  arrInput = "Mr. Nobody";
} 


var queryUrl = "http://www.omdbapi.com/?t=" + arrInput + "&y=&plot=short&tomatoes=true&apikey=trilogy";

request(queryUrl, function(error, response, body) {

if (!error && response.statusCode === 200) {



console.log("Title: " + JSON.parse(body).Title);
console.log("Release Year: " + JSON.parse(body).Year);
console.log("IMDB rating: " + JSON.parse(body).imdbRating);
console.log("Rotten Tomatoes rating: " + JSON.parse(body).tomatoRating);
console.log("Country producing: " + JSON.parse(body).Country);
console.log("Language: " + JSON.parse(body).Language);
console.log("Plot: " + JSON.parse(body).Plot);
console.log("Actors: " + JSON.parse(body).Actors);

var textToLog = "\n\n\n" + new Date() + "  **************************************\nmovie-this " + arrInput + "\n";
textToLog += "\nTitle: " + JSON.parse(body).Title;
textToLog += "\nRelease Year: " + JSON.parse(body).Year;
textToLog += "\nIMDB rating: " + JSON.parse(body).imdbRating;
textToLog += "\nRotten Tomatoes rating: " + JSON.parse(body).tomatoRating;
textToLog += "\nCountry producing: " + JSON.parse(body).Country;
textToLog += "\nLanguage: " + JSON.parse(body).Language;
textToLog += "\nPlot: " + JSON.parse(body).Plot;
textToLog += "\nActors: " + JSON.parse(body).Actors;

fs.appendFile('log.txt', textToLog, function (err) {
  if (err) return console.log(err);
  
});

}

});

textToLog = "";

}

function findBand(arrInput) {
  
  var queryUrl = "https://rest.bandsintown.com/artists/" + arrInput + "/events?app_id=codingbootcamp";
  
  
  request(queryUrl, function(error, response, body) {
    
    // If the request is successful
    if (!error && response.statusCode === 200) {
      
      var textToLog = "\n\n\n" + new Date() + "  **************************************\nconcert-this " + arrInput + "\n";

      console.log("Events for: " + arrInput);
      console.log("\n----------------------------------------------------------------\n\n\n");
      
          
          var concerts = JSON.parse(body);  //had to parse the whole body first

          for (var i = 0; i < concerts.length; i++) {

          console.log("Venue Name: " + concerts[i].venue.name);
            textToLog += "\nVenue Name: " + concerts[i].venue.name;

          if (concerts[i].venue.region != ""){

          console.log("Venue Location: " + concerts[i].venue.city + ", " + concerts[i].venue.region + "  " + concerts[i].venue.country );

          textToLog += "\nVenue Location: " + concerts[i].venue.city + ", " + concerts[i].venue.region + "  " + concerts[i].venue.country; 

          } else {
            console.log("Venue Location: " + concerts[i].venue.city + "  " + concerts[i].venue.country );

            textToLog += "\nVenue Location: " + concerts[i].venue.city + "  " + concerts[i].venue.country;
          }

          var rawDate = concerts[i].datetime;
          var concertDate = moment().year(rawDate.substring(0,4)).month(rawDate.substring(5,7)).day(rawDate.substring(8)).format("MM/DD/YYYY");
          console.log("Event Date: " + concertDate);
          textToLog += "\nEvent Date: " + concertDate;

          console.log("\n------------------------------------------------------------------\n\n");
          textToLog += "\n------------------------------------------------------------------\n\n" 
          }
          
          fs.appendFile('log.txt', textToLog, function (err) {
            if (err) return console.log(err);
            
         });

         textToLog = "";

        }
      });
  }

function findSong(arrInput){
  
  spotify.search({ type: 'track', query: arrInput }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var textToLog = "\n\n\n" + new Date() + "  **************************************\nspotify-this-song " + arrInput + "\n";

   for (var i = 0; i < data.tracks.items.length; i++){

    console.log("Artist:       "  , data.tracks.items[i].artists[0].name);
    console.log("Song:         "  , arrInput);
    console.log("Preview Link: "  , data.tracks.items[i].preview_url); 
    console.log("Album:        "  , data.tracks.items[i].name);

    console.log("\n\n-------------------------------------------------------------------------------------------------------\n\n");
   
    textToLog += "\nArtist:       "  + data.tracks.items[i].artists[0].name;
    textToLog += "\nSong:         "  + arrInput;
    textToLog += "\nPreview Link: "  + data.tracks.items[i].preview_url; 
    textToLog += "\nAlbum:        "  + data.tracks.items[i].name;  
    textToLog += "\n\n-------------------------------------------------------------------------------------------------------\n\n"
  
    fs.appendFile('log.txt', textToLog, function (err) {
      if (err) return console.log(err);
      
   });
   
   textToLog = "";
  
  
  }

  });

  }


function doTextInstruct() {

  fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }

    var separateAt = data.search(",");
    var randomAction = data.slice(0,separateAt);
    var arrInput = data.slice(separateAt + 1);

    if (randomAction == "movie-this"){
      findMovie(arrInput);
  } else if (randomAction == 'concert-this') {
      findBand(arrInput);
  } else if (randomAction == 'spotify-this-song') {
       findSong(arrInput);
  }   
  
  });



 }





