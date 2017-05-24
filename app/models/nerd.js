// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Schema
var nerdSchema = new Schema({
  name :  {type: String, default: ''}
})

// create model associated to the schema
var Nerd = mongoose.model('Nerd', nerdSchema);

// module.exports allows us to pass this to other files when it is called
module.exports = Nerd;
