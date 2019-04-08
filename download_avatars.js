var request = require('request');
var secrets = require('./secrets.js')
var fs = require('fs')
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var result = JSON.parse(body);
    cb(err, result);
  });
}


function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
          throw error
        })
         .pipe(fs.createWriteStream(filePath), function(response) {
          console.log('Downloading image...');
        })
         .on('finish', function(response) {
          console.log('Download Complete.');
        })
       }

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  for(var eachObject of result) {
    var url = eachObject['avatar_url'];
    var filePath = "avatars/" + eachObject['login'] + ".jpg"
    downloadImageByURL(url, filePath);
  }
});









