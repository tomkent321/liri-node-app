require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require("fs");
var moment = require("moment");




//get user input

var action = process.argv[2];
var arrInput = (process.argv.slice(3)).join(" ");

console.log("action " + action);
console.log("arrInput " + arrInput);



if (action == "movie-this"){

    if (arrInput == ""){
        arrInput = "Mr. Nobody";
    } 
// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + arrInput + "&y=&plot=short&tomatoes=true&apikey=trilogy";

// This line is just to help us debug against the actual URL.
//console.log(queryUrl);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes rating: " + JSON.parse(body).tomatoRating);
    console.log("Country producing: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);

  }
});
} else if (action == 'concert-this') {


    var queryUrl = "https://rest.bandsintown.com/artists/" + arrInput + "/events?app_id=codingbootcamp";
console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
      
          

          var concerts = JSON.parse(body);  //had to parse the whole body first

          console.log(concerts[1].venue.name);
          console.log(concerts[1].venue.city + ", " + concerts[1].venue.region );

          var rawDate = concerts[1].datetime;
          var concertDate = moment().year(rawDate.substring(0,4)).month(rawDate.substring(5,7)).day(rawDate.substring(8)).format("MM/DD/YYYY");
          
          


          console.log("Concert Date: " + concertDate);
          
          



          // Name of the venue
          // Venue location
          // Date of the Event (use moment to format this as "MM/DD/YYYY")





        }
      });

} else if (action == 'spotify-this-song') {




    // Spotify
    // .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
    // .then(function(data) {
    //   console.log(data); 
    // })
    // .catch(function(err) {
    //   console.error('Error occurred: ' + err); 
    // });


  
 

     
    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     
    console.log(data.tracks.items[0]); 
    });








} else if (action = 'do-what-it-says') {


  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // We will then print the contents of data
    console.log(data);
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(", ");
  
    // We will then re-display the content as an array for later use.
    console.log(dataArr);
  
  });







}