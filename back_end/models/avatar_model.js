var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvatarSchema = new Schema({
	avatar_num: {type: Number, unique: true},
	avatar_value: {type: String, require: true},
}, {collection:'Avatar'});

var Avatar = mongoose.model('Avatar', AvatarSchema);