var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
//processes terminal arguments
var repoOwner = process.argv[2];
var repoName = process.argv[3];


console.log('Welcome to the GitHub Avatar Downloader!');

// if statement accounts for whether two arguments were inputted in terminal
// throws error if not all arguments are available
if (process.argv.length < 4) {
  throw "please provide the repoOwner and the repoName";
}

// concatanates terminal arguments to the url
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    //result parses produced stream into JSON
    var result = JSON.parse(body);
    cb(err, result);
  });
}

//function that extracts and stores the avatar image based on the avatar url and
//filePath provided in the callback function loop
function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
          throw error;
        })
         .pipe(fs.createWriteStream(filePath), function(response) {
          console.log('Downloading image...');
        })
         .on('finish', function(response) {
          console.log('Download Complete.');
        });
       }

//specifies the cb function as part of the loop that runs on JSON results created
getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  for(var eachObject of result) {
    var url = eachObject['avatar_url'];
    var filePath = "avatars/" + eachObject['login'] + ".jpg";
    downloadImageByURL(url, filePath);
  }
});







