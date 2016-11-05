// require mongoose
var mongoose = require('mongoose');
// creates Schema class
var Schema = mongoose.Schema;

// Creates article schema
var ArticleSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  source: {
    type:String,
    unique:true,
    required:true,
    lowercase: true,
    trim: true
  },
  stickyNotes: [{
    type: Schema.Types.ObjectId,
    ref: 'StickyNote'
  }]
});

//Removes query string from source URL
ArticleSchema.pre('save', function(next){
  this.source = this.source.split(/[?#]/)[0];
  next();
});

// Creates the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// Exports the model
module.exports = Article;