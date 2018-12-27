var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicSchema = new Schema({
    song_name: {type: String},
	singer_name: {type: String},
	// timestamp: {type: Date},
	song_words: {type: String},
    song_url: {type: String, unique: true},
    love_number: {type: Number, default: 0},
    comments: [{type: Schema.ObjectId, ref:'Comment', default: null}]
}, {collection:'Music'});

var Music = mongoose.model('Music', MusicSchema);