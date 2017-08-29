"use-strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RoomSchema = new Schema({
	name : {
		type : String,
		unique : true,
		required : true
	},

	desc : {
		type : String,
		unique : false,
		required : false
	},

	messages : [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message'
	}]

});

module.exports = mongoose.model('Room', RoomSchema);
