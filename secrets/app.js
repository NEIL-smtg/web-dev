//jshint esversion:6

//	to hide apikeys, encryption key...
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const encrypt = require('mongoose-encryption');

//	hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

//	cookie auth
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const GoogleStrategy = require('passport-google-oauth20');
const findOrCreate = require('mongoose-findorcreate');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//	cookies
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'our little secret.',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//	for encryption purposes
const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
	secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

/*
	1.ceaser cipher encryption

	extend the power of schema ...
	declare before modeling
	to encrypt only the password field, var name should be same
	automatically encrypted when .save()
	automatically decryp when find/update...
	userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
*/

const userModel = new mongoose.model('user', userSchema);

passport.use(userModel.createStrategy());
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
	await mongoose.connect('mongodb://127.0.0.1:27017/secret');
	const result = await userModel.findById(id);
	done(null, result);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/secrets',
	scope: ['profile'],
  },
  async function(accessToken, refreshToken, profile, cb) {    
	await mongoose.connect('mongodb://127.0.0.1:27017/secret');
	await userModel.findOrCreate({googleId: profile.id}, function(err, user) {
		return cb(err, user);
	});
  }
));

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/auth/google',
	passport.authenticate('google')
);

app.get('/auth/google/secrets', 
	passport.authenticate('google', {failureRedirect: '/login'}),
	function(req, res) {
		res.redirect('/secrets');
	}
);

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/register', function(req, res) {
	res.render('register');
});

app.post('/register', function(req, res) {

	userModel.register(
		{username: req.body.username},
		req.body.password,
		function(err, user) {
			if (err){
				console.log('error registrating...' + err);
				res.redirect('/register');
			}
			else{
				passport.authenticate('local')(req, res, function () {
					res.redirect('/secrets');
				});
			}
		});
});

app.post('/login', async function(req, res) {

	const user = new userModel({
		username: req.body.username,
		password: req.body.password
	});

	req.login(user, function(err) {
		if (err) {
			console.log(err);
		} else{
			passport.authenticate('local')(req, res, function () {
				res.redirect('/secrets');
			});
		}
		});
});

app.get('/secrets', async function(req, res) {
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/secret'); 
		const found = await userModel.find({'secret' : {$ne: null}});
		
		if (found) {
			res.render('secrets', {userWithSecrets: found});
		} else {
			console.log(error);
			res.send(error);
		}
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

app.get('/logout', function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

app.get('/submit', function(req, res) {
	if (req.isAuthenticated()){
		res.render('submit');
	} else{
		res.redirect('/login');
	}
});

app.post('/submit', async function (req, res) {
	const submittedSecret = req.body.secret;
	const id = req.user.id;

	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/secret');
		const found = await userModel.findById(id);

		if (found){
			console.log('Secret submitted.');
			found.secret = submittedSecret;
			await found.save();
			res.redirect('/secrets');
		} else {
			console.log('User not found');
		}
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

app.listen(4000, function () {
	console.log('Running on port 4000.');
});