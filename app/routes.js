// app/routes.js

var mongoose = require('mongoose');

// grab the nerd model we just created
var Nerd = require('./models/nerd');

var uri = "mongodb://localhost/path/to/database";
mongoose.connect(uri, function(err) {
 if (err) return console.log(err);
 console.log("Connected successfully to server");
});

module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  // sample api route
  app.get('/api/nerds', function(req, res) {
    // use mongoose to get all nerds in the database
    Nerd.find(function(err, nerds) {
      // if there is an error retrieving, send the error.
                      // nothing after res.send(err) will execute
      if (err)
        res.send(err);

      console.log(nerds);
      res.json(nerds); // return all nerds in JSON format
    });
  });

  app.post('/api/nerd', function(req, res) {
    var newNerd = Nerd({name : req.param('nerdName')});
    console.log(req.param('nerdName'));
    newNerd.save(function(err){
      if (err) return console.log(err)
      console.log('new Nerd saved to database')
    });
    return
  });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html'); // load our public/index.html file
  });

};
