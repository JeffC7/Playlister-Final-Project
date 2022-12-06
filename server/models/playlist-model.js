const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        userName: { type: String, required: false },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        published: {type: String, required: false},
        likes: {type: [{
            type: String
        }], required: false},
        dislikes: {type: [{
            type: String
        }], required: false},
        listens: {type: Number, required: false},
        comments: {type: [{
            userName: String,
            comment: String,
        }], required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
