// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// ===============================================================================

var friends = require('../data/friends.js');

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // This is the API path to get the friends data in json format
  // Activated on both html pages with blue API Link
  app.get('/api/friends', function (req,res) {
      res.json(friends);
  });

  // Sends data back with a compatible friend
  app.post('/api/friends', function (req, res) {
      var newFriend = req.body;

      // Best match score
      var bestMatch = {};

      for(var i = 0; i < newFriend.scores.length; i++) {
        if(newFriend.scores[i] == "1 (Strongly Disagree)") {
          newFriend.scores[i] = 1;
        } else if(newFriend.scores[i] == "5 (Strongly Agree)") {
          newFriend.scores[i] = 5;
        } else {
          newFriend.scores[i] = parseInt(newFriend.scores[i]);
        }
      }


      var bestMatchIndex = 0;
      var bestMatchDifference = 40;

      for(var i = 0; i < friends.length; i++) {
        var totalDifference = 0;

        for(var index = 0; index < friends[i].scores.length; index++) {
          var differenceOneScore = Math.abs(friends[i].scores[index] - newFriend.scores[index]);
          totalDifference += differenceOneScore;
        }

        if (totalDifference < bestMatchDifference) {
          bestMatchIndex = i;
          bestMatchDifference = totalDifference;
        }
      }

      // Best match information
      bestMatch = friends[bestMatchIndex];

      // Pushes the new friend in the database array
      friends.push(newFriend);

      // Returns new friend
      res.json(bestMatch);
  });

}