import express from 'express';
import path  from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import Users from './models'
import Documents from './models'
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

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

app.post('/:id/save', function(req, res) {
  var id = req.params.id
  Document.findById(id, function(err, doc) {
      if (err) {
        console.log('error in finding doc to save', err)
      }
      else {
        Users.find({username: req.user}, function(err, user) {
          if (err) {
            console.log('error finding user', err)
          }
          else {
            if (doc.author === user._id) {
              Document.update({_id: id}, {
                content: this.editorState
              }), function(err, affected, resp) {
                console.log('Document updated and saved!', resp)
                }
            }
            else if (doc.collaborators.includes(user._id)) {
              Document.update({_id: id}, {
                content: this.editorState
              }), function(err, affected, resp) {
                console.log('Document updated and saved!', resp)
                }
            }
            else {
              var collabArr = doc.collaborators.slice()
              collabArr.push(user._id)
              Document.update({_id: id}, {
                content: this.editorState,
                collaborators: collabArr
              }), function(err, affected, resp) {
                console.log('Document updated and saved! Collaboratoradded', resp)
                }
              }
            }
          })
        }
      })
})


app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
