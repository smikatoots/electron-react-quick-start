var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
// mongoose.connect(connect);
var schema = mongoose.Schema;

var UsersSchema = schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Documents'
        },
    ]
})
var DocumentsSchema = schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
	author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
	},
    // collaborators: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Users'
    //     },
    // ],
    // password: {
    //     type: String
    // }
    // PASSWORD SAME AS ID?
})

var Users = mongoose.model('Users', UsersSchema);

var Documents = mongoose.model('Documents', DocumentsSchema);


module.exports = {
    Users: Users,
    Documents: Documents
}
