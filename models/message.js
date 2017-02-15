"use-strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	
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

		
     