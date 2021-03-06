var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var ReactDOMServer = require('react-dom/server');
var app = express();

mongoose.Promise = global.Promise
var Models = require('./models')
var MongoStore = require('connect-mongo')(session)
var app = express();
var Document = Models.Document;
var User = Models.User;
var connect = process.env.MONGODB_URI
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const colors = ['YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'ORANGE', 'PINK'];

app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
mongoose.connect(connect);
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log('deserialize id', id);
  User.findById(id, (err, user) => {
      console.log('user', user);
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

app.post('/register', function(req, res) {
	console.log('registering')
	if (req.body.username && req.body.password) {
		User.find({ username: req.body.username }, function(err, user){
			if (err) console.log(err);
			else if (user) {
				console.log('Username taken');
				res.json({success: false});
			}
			else {
				new User({
					username: req.body.username,
					password: req.body.password,
                    documents: []
				}).save(function(err, user) {
					if (err) console.log("Error", err);
					else res.json({success: true});
				});
			}
		})
	}
	else {
		console.log('Missing username or password');
		res.json({success: false});
	}
})

app.post('/login', passport.authenticate('local'));

app.use('/login', function(req, res){
	if (req.user) res.json({userId: req.user._id, success: true});
	else res.json({success: false});
})

app.post('/new', function(req, res) {
  var id = req.user._id; //req.body.userId
  var newDoc = new Document({
    title: req.body.title,
    content: [],
    // collaborators: [req.body.user._id]
  })
  newDoc.save(function(err, doc) {
    if (err) {
      console.log('Error in saving', err)
      res.json(err)
    }
    else {
      console.log('Success! Document saved', doc)
        User.findById(id, function(err, user) {
          if (err) {
              console.log(err)
          }
          else {
              var docArr = user.documents
              docArr.push(doc._id)
              User.findOneAndUpdate({_id: user._id}, {documents: docArr}, {new: true})
              .populate('documents')
              .exec((err, resp) => {
                  console.log('New document *actually* saved!', resp)
                  res.json(resp)
              })
          }
        })
    }
  })
})
app.post('/accessShared', function(req, res) {
  var docId = req.body.docId
  var id = req.user._id
  Document.findById(id, function(err, foundDoc) {
    if (err) {
      console.log('unable to find document', err)
    }
    else {
      console.log('found a document correctly', id)
      User.findById(id, function(err, foundUser) {
          if (err) {
              console.log(err)
          }
          else {
            console.log('user is found', foundUser)
              var docArr = foundUser.documents
              docArr.push(docId)
              User.findOneAndUpdate({_id: foundUser._id}, {documents: docArr})
              .populate('documents')
              .exec((err, resp) => {
                  console.log('New document *actually* saved!', resp)
                  res.json(resp)
              })
          }
        })
    }
  })
})
app.post('/allDocs', function(req, res) {
	console.log("req.user", req.user);
    var userId = req.user._id; //req.body.userId
    User.findById(userId)
    .populate('documents')
    .exec((err, userFound) => {
        res.json(userFound)
    })
})

app.post('/editor/:id', function(req, res) {
  var id = req.params.id;
  Document.findById(id, function(err, doc) {
    if (err) {
      console.log('Error in finding document', id)
    }
    else {
      console.log('Document found', id, doc);
      res.json(doc);
    }
  })
})

app.post('/save', function(req, res) {
  var docId = req.body.docId;
  Document.findById(docId, (err, foundDoc) => {
      if (err) {
          console.log("Error!", err);
      }
      else {
        var docContent = req.body.content
        var saveTime = new Date();
        var docObj = {time: saveTime, content: docContent}
        foundDoc.content.push(docObj)
        foundDoc.save(function(err, savedDoc) {
          console.log("Success saving!", savedDoc);
        })
      }
  })
})

var server = require('http').Server(app);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('leave room', (data) => {
    socket.leave(data.room)
  })

  socket.on('room', function(data) {
    socket.join(data.room);
    socket.emit('room', colors[socket.adapter.rooms[data.room].length - 1])
  });

  socket.on('coding event', function(data) {
    socket.broadcast.to(data.room).emit('receive code', {contentState: data.contentState, anchorKey: data.anchorKey, focusKey: data.focusKey, anchorOffset: data.anchorOffset, focusOffset: data.focusOffset});
  });
});

server.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})

module.exports = app;
