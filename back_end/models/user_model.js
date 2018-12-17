var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type: String, unique: true},
	password_hash: {type: String, required: true},
	selftext: {type: String, default: ""},
	//telnumber: {type: String, default: ""},
	email: {type: String, default: ""},
	avatar_url: {type:String, default: ""},		//to add a picture url here

	music_lists: [{type: Schema.ObjectId, ref:'MusicList', default: null}],

	focus_users: [{type: Schema.ObjectId, ref:'User', default: null}],
	fans: [{type: Schema.ObjectId, ref:'User', default: null}],

	favourite_music: [{type: Schema.ObjectId, ref:'Music', default: null}]
	// tickets: [{type: Schema.ObjectId, ref:'Ticket', default: null}],
	// film_favourite: [{type: Schema.ObjectId, ref:'Film', default: null}]
}, {collection:'User'});

var User = mongoose.model('User', UserSchema);
