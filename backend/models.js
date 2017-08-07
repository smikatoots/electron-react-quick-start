var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
mongoose.connect(connect);
var schema = mongoose.Schema;

var UsersSchema = schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
})
var DocumentsSchema = schema({
	author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
	},
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
    ],
    password: {
        type: String
    }
})

var Users = mongoose.model('Users', UsersSchema);

var Documents = mongoose.model('Documents', DocumentsSchema);


module.exports = {
    Users: Users,
    Documents: Documents
}
