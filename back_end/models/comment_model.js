var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReplySchema = new Schema({
	username: String,
	content: String,
	timestamp: {type: Date, default: Date.now},
	replies: [{type: Schema.ObjectId, ref:'Reply', default: null}]
}, {collection:'Reply'});

var CommentSchema = new Schema({
	username: String,
	song_name: String,
	content: {type: String, required: true},
	timestamp: {type: Date, default: Date.now},
	replies: [{type: Schema.ObjectId, ref:'Reply', default: null}],
    likeUsers: [{type: Schema.ObjectId, ref:'User', default: null}]
}, {collection:'Comment'});

var Reply = mongoose.model('Reply', ReplySchema);
var Comment = mongoose.model('Comment', CommentSchema);