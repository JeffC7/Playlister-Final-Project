const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {

                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        var index = user.playlists.indexOf(req.params.id);
                        if (index !== -1) {
                            user.playlists.splice(index, 1);
                            user.save();
                        }
                        return res.status(200).json({success: true});
                    }).catch(err => console.log(err))
                }
                else {
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if(list.published != ""){
            return res.status(200).json({ success: true, playlist: list })
        } else {

            // DOES THIS LIST BELONG TO THIS USER?
            async function asyncFindUser(list) {
                await User.findOne({ email: list.ownerEmail }, (err, user) => {
                    if (user._id == req.userId) {
                        return res.status(200).json({ success: true, playlist: list })
                    }
                    else {
                        console.log("incorrect user!");
                        return res.status(400).json({ success: false, description: "authentication error" });
                    }
                });
            }
            asyncFindUser(list);
        }
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    if(req.userId == "guest"){
        return res.status(200).json({ success: true, idNamePairs: [] })
    }
    await User.findOne({ _id: req.userId }, (err, user) => {
        async function asyncFindList(email) {
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            userName: user.userName
                        };
                        if(list.published != "")
                            pair = {...pair, likes: list.likes.length, dislikes: list.dislikes.length};
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        if(playlist.published != ""){
            playlist.name = body.playlist.name;
            playlist.songs = body.playlist.songs;
            playlist
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: playlist._id,
                        message: 'Playlist updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Playlist not updated!',
                    })
                })
        } else {
        // DOES THIS LIST BELONG TO THIS USER?
            async function asyncFindUser(list) {
                await User.findOne({ email: list.ownerEmail }, (err, user) => {
                    if (user._id == req.userId) {
                        list.name = body.playlist.name;
                        list.songs = body.playlist.songs;
                        list
                            .save()
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    id: list._id,
                                    message: 'Playlist updated!',
                                })
                            })
                            .catch(error => {
                                return res.status(404).json({
                                    error,
                                    message: 'Playlist not updated!',
                                })
                            })
                    }
                    else {
                        return res.status(400).json({ success: false, description: "authentication error" });
                    }
                });
            }
            asyncFindUser(playlist);
        }
    })
}

publishPlaylist = async (req, res) => {
    // const body = req.body
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // publish the playlist
        async function asyncFindUserAndPublish(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    list.published =  new Date(Date.now()).toDateString().substring(4);
                    list.likes = [];
                    list.dislikes = [];
                    list.listens = 0;
                    list.comments = [];
                    list.userName = user.userName;
                    list
                        .save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist published!',
                            })
                        })
                        .catch(error => {
                            return res.status(404).json({
                                error,
                                message: 'Playlist not published!',
                            })
                        })
                }
                else {
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUserAndPublish(playlist);
    })
}

duplicatePlaylist = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // duplicate the playlist
        async function asyncDuplicatePlaylist(list) {
            User.findOne({ _id: req.userId }, (err, user) => {

                async function asyncDuplicatePlaylist2(list, user) {
                    Playlist.find({name: new RegExp('^' + list.name)}, 'name', function (err, names){
                        const duplicate = new Playlist();
                        duplicate.songs = list.songs;
                        duplicate.ownerEmail = req.body.email;
                        var newName = list.name;
                        
                        var nameFound = names[names.length-1].name;
                        if(nameFound == list.name) 
                            newName = nameFound + "1"
                        else {
                            newName = list.name + (parseInt(nameFound.charAt(nameFound.length-1)) + 1);
                        }

                        duplicate.name = newName;
                        duplicate.published = "";
        
                        user.playlists.push(duplicate._id);
                        user
                            .save()
                            .then(() => {
                                duplicate
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        success: true,
                                        playlist: duplicate,
                                    })
                                })
                                .catch(error => {
                                    return res.status(404).json({
                                        error,
                                        message: 'Playlist not duplicated!',
                                    })
                                })
                            })
                    })
                }
                asyncDuplicatePlaylist2(list, user)
            })
        }
        asyncDuplicatePlaylist(playlist);
    })
}

addComment = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add a comment',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // Add a comment
        async function asyncAddComment(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                var newComment = {userName: user.userName, comment: req.body.comment}
                list.comments.push(newComment);
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            playlist: list,
                            message: 'Comment added!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Comment not published!',
                        })
                    })
            });
        }
        asyncAddComment(playlist);
    })
}

addLike = async (req, res) => {
    const body = req.body;
    console.log("Increment like: " + JSON.stringify(body));

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // Add a comment
        async function asyncAddLike(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                console.log("HEEEY, I FAILED HERE11")
                if(!list.dislikes.includes(user.userName) && !list.likes.includes(user.userName)){
                    console.log("HEEEY, I FAILED HERE")
                    list.likes.push(user.userName);
                }
                console.log("HEEEY, I FAILED HERE2")
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            playlist: list,
                            message: 'Comment added!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Comment not published!',
                        })
                    })
            });
        }
        asyncAddLike(playlist);
    })
}

addDislike = async (req, res) => {
    const body = req.body;
    console.log("Decrement like: " + JSON.stringify(body));

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // Add a comment
        async function asyncAddDislike(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(!list.dislikes.includes(user.userName) && !list.likes.includes(user.userName)){
                    list.dislikes.push(user.userName);
                }
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            playlist: list,
                            message: 'Comment added!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Comment not published!',
                        })
                    })
            });
        }
        asyncAddDislike(playlist);
    })
}

searchPlaylistForUser = async(req, res) => {
    Playlist.find({userName: new RegExp(req.params.username), published: {"$exists" : true, "$ne" : ""}}, (err, playlists) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Error finding playlists for username!',
            })
        }
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                likes: list.likes.length,
                dislikes: list.dislikes.length,
                userName: list.userName
            };
            pairs.push(pair);
        }

        return res.status(200).json({ success: true, idNamePairs: pairs })
    })
}

searchPlaylist = async(req, res) => {
    Playlist.find({name: new RegExp(req.params.search)}, (err, playlists) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Error finding playlists for username!',
            })
        }
        let pairs = [];
        if(req.userId == "guest"){
            for (let key in playlists) {
                let list = playlists[key];
                if(list.published == "")
                    continue;
                let pair = {
                    _id: list._id,
                    name: list.name,
                    published: list.published,
                    likes: list.likes.length,
                    dislikes: list.dislikes.length,
                    userName: list.userName
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        } else { 
            async function asyncSearchUserPlaylist(playlists) {
                await User.findOne({ _id: req.userId }, (err, user) => {
                    for (let key in playlists) {
                        let list = playlists[key];
                        console.log(list.ownerEmail + "   " +  req.email)
                        console.log(list.published + "<<<<<")
                        if(list.ownerEmail != user.email && list.published == "")
                            continue;
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            likes: list.likes.length,
                            dislikes: list.dislikes.length,
                            userName: list.userName
                        };
                        pairs.push(pair);
                    }
                    
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                });
            }
            asyncSearchUserPlaylist(playlists);
        }
    })
}

searchPersonalPlaylist = async(req, res) => {
    Playlist.find({name: new RegExp(req.params.search)}, (err, playlists) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Error finding playlists for username!',
            })
        }
        let pairs = [];
        if(req.userId == "guest"){
            return res.status(200).json({ success: true, idNamePairs: [] })
        } else { 
            async function asyncSearchUserPlaylist(playlists) {
                await User.findOne({ _id: req.userId }, (err, user) => {
                    for (let key in playlists) {
                        let list = playlists[key];
                        console.log(list.ownerEmail + "   " +  req.email)
                        console.log(list.published + "<<<<<")
                        if(list.ownerEmail != user.email)
                            continue;
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            likes: list.likes.length,
                            dislikes: list.dislikes.length,
                            userName: list.userName
                        };
                        pairs.push(pair);
                    }
                    
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                });
            }
            asyncSearchUserPlaylist(playlists);
        }
    })
}

getSong = async(req, res) => {
    Playlist.findOne({_id: req.params.id}, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Error finding playlist for songs',
            })
        }

        return res.status(200).json({ success: true, songs: playlist })
    })
}


module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    publishPlaylist,
    duplicatePlaylist,
    addComment,
    addLike,
    addDislike, 
    searchPlaylistForUser,
    searchPlaylist,
    getSong,
    searchPersonalPlaylist
}