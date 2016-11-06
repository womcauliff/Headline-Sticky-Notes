// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the StickyNote schema
var StickyNoteSchema = new Schema({
  body: {
    type:String
  }
});

// create the StickyNote model with the NoteSchema
var StickyNote = mongoose.model('StickyNote', StickyNoteSchema);

// export the StickyNote model
module.exports = StickyNote;