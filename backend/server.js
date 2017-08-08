var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');

var ReactDOMServer = require('react-dom/server');

var User = require('./models').User;
var Document = require('./models').Document;

var app = express();
app.use(session({ secret: 'keyboard cat'}));

var db = process.env.MONGODB_URI;
mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (request, response) => {
//     response.sendFile(__dirname + '/public/index.html'); // For React/Redux
// });

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.findOne({ username: username}, function(err, user){
    if (err) {
      console.log(err);
      return done(err);
    }
    if (!user) {
      console.log(user);
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/register', function(req, res) {
	console.log('registering')
	if (req.body.username && req.body.password) {
		new User({
			username: req.body.username,
			password: req.body.password
		}).save(function(err, user) {
			if (err) console.log("Error", err);
			else res.json({success: true});
		});
	}
})

app.post('/verify', function(req, res) {
	if (req.user) {
		res.json({success: true})
	}
	else res.json({success: false})
})

app.post('/login', passport.authenticate('local'));

app.use('/login', function(req, res){
	console.log("req.user", req.user);
	if (req.user) res.json({success: true});
	else res.json({success: false});
})

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})

module.exports = app;