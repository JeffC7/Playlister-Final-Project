/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.put('/playlistpub/:id', auth.verify, PlaylistController.publishPlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
// router.get('/playlistList', auth.verify, PlaylistController.getPlaylistList)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.post('/duplicateplaylist/:id', auth.verify, PlaylistController.duplicatePlaylist)
router.post('/addcomment/:id', auth.verify, PlaylistController.addComment)
router.post('/addlike/:id', auth.verify, PlaylistController.addLike)
router.post('/adddislike/:id', auth.verify, PlaylistController.addDislike)
router.get('/searchplaylistforuser/:username', auth.verify, PlaylistController.searchPlaylistForUser)
router.get('/searchplaylist/:search', auth.verify, PlaylistController.searchPlaylist)
router.get('/songs/:id', auth.verify, PlaylistController.getSong)

module.exports = router