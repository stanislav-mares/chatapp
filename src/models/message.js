"use-strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({

	id : {
		type: String,
		unique: true,
		required: true
	},

	text : {
		type : String,
		unique: false,
		required : true
	},

	nameRoom : {
		type : String,
		unique: false,
		required : true
	},

	nameUser : {
		type : String,
		unique: false,
		required : true
	},

	time : {
		type : Date,
		unique: false,
		required : true
	}

});

module.exports = mongoose.model('Message', MessageSchema);
