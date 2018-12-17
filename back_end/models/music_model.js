var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicSchema = new Schema({
    song_name: {type: String},
	singer_name: {type: String},
	// timestamp: {type: Date},
	song_words: {type: String},
    comments: [{type: Schema.ObjectId, ref:'Comment', default: null}]
}, {collection:'Music'});

var Music = mongoose.model('Music', MusicSchema);