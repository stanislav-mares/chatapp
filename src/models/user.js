"use-strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');


var UserSchema = new Schema({
	name : {
		type : String,
		unique : true,
		required : false
	},

	email : {
		type : String,
		unique : true,
		required : false
	},

	password : {
		type : String,
		unique : false,
		required : true
	}

});

UserSchema.pre('save', function(next) {
	var user = this;

	if(this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) {
				return next(err);
			}

			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					return next(err);
				}

				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
