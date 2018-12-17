var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicListSchema = new Schema({
	list_name: {type: String},
    description: {type: String},
	songList: [{type: Schema.ObjectId, ref:'Music', default: null}]
}, {collection:'MusicList'});

var MusicList = mongoose.model('MusicList', MusicListSchema);