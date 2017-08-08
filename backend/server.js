var express = require('express');
var path  = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
var Models = require('./models')
var MongoStore = require('connect-mongo')(session)
var app = express();
var Document = Models.Documents
var User = Models.Users

var connect = process.env.MONGODB_URI
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
mongoose.connect(connect);


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

// Example route
app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.post('/show/:id', function(req, res) {
  var id = req.params.id
  Document.findById(id, function(err, doc) {
    if (err) {
      console.log('error in finding document', id)
    }
    else {
      res.json(doc)
    }
  })
})

app.post('/save', function(req, res) {
  console.log('hey', req.body)
  var newDoc = new Document({
    title: 'yo',
    content: req.body.content,
    collaborators: []
  })
  console.log('yo', newDoc)
  newDoc.save(function(err, doc) {
    if (err) {
      console.log('error in saving', err)
      res.json(err)
    }
    else {
      console.log('success! doc saved.', doc)
      res.json(doc)
    }
  })
  // var id = req.params.id
  // Documents.findById(id, function(err, doc) {
  //     if (err) {
  //       console.log('error in finding doc to save', err)
  //     }
  //     else {
  //       Users.find({username: req.user}, function(err, user) {
  //         if (err) {
  //           console.log('error finding user', err)
  //         }
  //         else {
  //           if (doc.author === user._id) {
  //             Document.update({_id: id}, {
  //               content: this.editorState
  //             }), function(err, affected, resp) {
  //               console.log('Document updated and saved!', resp)
  //               }
  //           }
  //           else if (doc.collaborators.includes(user._id)) {
  //             Document.update({_id: id}, {
  //               content: this.editorState
  //             }), function(err, affected, resp) {
  //               console.log('Document updated and saved!', resp)
  //               }
  //           }
  //           else {
  //             var collabArr = doc.collaborators.slice()
  //             collabArr.push(user._id)
  //             Document.update({_id: id}, {
  //               content: this.editorState,
  //               collaborators: collabArr
  //             }), function(err, affected, resp) {
  //               console.log('Document updated and saved! Collaboratoradded', resp)
  //               }
  //             }
  //           }
  //         })
  //       }
  //     })
})


app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
