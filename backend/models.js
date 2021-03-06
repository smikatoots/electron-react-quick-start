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
            ref: 'Document'
        },
    ]
})
var DocumentsSchema = schema({
    title: {
        type: String
    },
    content: {
        type: Array
    },
	author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

var User = mongoose.model('User', UsersSchema);

var Document = mongoose.model('Document', DocumentsSchema);


module.exports = {
    User: User,
    Document: Document
}
