var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type: String, unique: true},
	password_hash: {type: String, required: true},
	//telnumber: {type: String, default: ""},
	email: {type: String, default: ""},
	avatar_url: {type:String, default: ""},		//to add a picture url here
	tickets: [{type: Schema.ObjectId, ref:'Ticket', default: null}],
	film_favourite: [{type: Schema.ObjectId, ref:'Film', default: null}]
}, {collection:'User'});

var User = mongoose.model('User', UserSchema);
