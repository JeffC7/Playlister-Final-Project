import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
// console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS", 
    CLEAR: "CLEAR",
    PLAY_PLAYLIST: "PLAY_PLAYLIST",
    SHOW_ACCOUNT_ERROR_MODAL: "SHOW_ACCOUNT_ERROR_MODAL",
    SET_SORT_METHOD: "SET_SORT_METHOD"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

export const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ACCOUNT_ERROR: "ACCOUNT_ERROR"
}

const SortMethod = {
    NAME: "NAME",
    PUBLISHED: "PUBLISHED",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES"

}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentPlayed: null,
        currentPlayedSongIndex: 0,
        playVideo: true,
        sortM: SortMethod.NAME
    });
    const history = useHistory();

    // console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    // console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CLEAR: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: null,
                    currentPlayedSongIndex:  0,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore((curstore) => ({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: curstore.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                }));
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: payload,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.SHOW_ACCOUNT_ERROR_MODAL: {
                return setStore({
                    currentModal : CurrentModal.ACCOUNT_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.PLAY_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: payload,
                    currentPlayedSongIndex:  0,
                    sortM: store.sortM
                });
            }
            case GlobalStoreActionType.SET_SORT_METHOD: {
                console.log("payload" + payload)
                return setStore((curstore) => ({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayed: store.currentPlayed,
                    currentPlayedSongIndex:  store.currentPlayedSongIndex,
                    sortM: payload
                }));
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            store.loadIdNamePairs();
                            // response = await api.getPlaylistPairs();
                            // if (response.data.success) {
                            //     let pairsArray = response.data.idNamePairs;
                            //     storeReducer({
                            //         type: GlobalStoreActionType.CHANGE_LIST_NAME,
                            //         payload: {
                            //             idNamePairs: pairsArray,
                            //             playlist: {}
                            //         }
                            //     });
                            // }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        // history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email);
        console.log("createNewList response: " + store.newListCounter);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/");
            store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (method = "NAME") {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                //sort
                switch (method){
                    case SortMethod.NAME: {
                        pairsArray.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                              }
                              if (a.name > b.name) {
                                return 1;
                              }
                              return 0;
                        })
                        break;
                    }
                    case SortMethod.PUBLISHED: {
                        console.log("sort by published")
                        pairsArray.sort((a, b) => {
                            var aV = a.published == "" ? "Dec 19 1800" : a.published; 
                            var bV = b.published == "" ? "Dec 19 1800" : b.published; 
                            return new Date(bV) - new Date(aV);
                        })
                        break;
                    }
                    case SortMethod.LIKES: {
                        pairsArray.sort((a, b) => {
                            var aV = a.published == "" ? -1 : a.likes; 
                            var bV = b.published == "" ? -1 : b.likes; 
                            return bV - aV;
                        })
                        break;
                    }
                    case SortMethod.DISLIKES: {
                        pairsArray.sort((a, b) => {
                            var aV = a.published == "" ? -1 : a.dislikes; 
                            var bV = b.published == "" ? -1 : b.dislikes; 
                            return bV - aV;
                        })
                        break;
                    }
                    default:
                        pairsArray.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                              }
                              if (a.name > b.name) {
                                return 1;
                              }
                              return 0;
                        })

                }
                console.log(pairsArray)

                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.unmarkListForDeletion = function () {
        store.hideModals();
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                // history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.clearAll();
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    // console.log("heelloooo");
                    // history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }
    store.showAccountErrorModal = function(){
        storeReducer({
            type: GlobalStoreActionType.SHOW_ACCOUNT_ERROR_MODAL,
            payload: {}
        });
    }
    store.hideAccountErrorModal = function(){
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isAccountErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ACCOUNT_ERROR;
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    store.publish = function (id) {
        async function publishList() {
            let response = await api.publishPlaylist(id);
            if (response.data.success) {
                console.log("success");
                store.loadIdNamePairs();
            }
        }
        publishList(id);
    }

    store.duplicatePlaylist = function (id) {
        async function duplicateList() {
            let newListName = "Untitled" + store.newListCounter;
            const response = await api.duplicatePlaylist(id, newListName, auth.user.email);
            console.log("duplicatePlaylist response: " + response);
            if (response.status === 200) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: newList
                });
                store.loadIdNamePairs();
            }
            else {
                console.log("API FAILED TO DUPLICATE A NEW LIST");
            }
        }
        duplicateList(id);
    }

    store.addComment = function (id, comment) {
        async function asyncAddComment(id, comment) {
            const response = await api.addComment(id, comment);
            console.log("asyncAddComment response: " + response);
            if (response.status === 200) {
                console.log(response.data);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: response.data.playlist
                })
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncAddComment(id, comment);
    }

    store.addLike = function (id) {
        async function asyncAddLike(id) {
            const response = await api.addLike(id);
            console.log("asyncAddLike response: " + response);
            if (response.status === 200) {
                console.log(response.data);
                // storeReducer({
                //     type: GlobalStoreActionType.SET_CURRENT_LIST,
                //     payload: response.data.playlist
                // })
                store.loadIdNamePairs();
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncAddLike(id);
    }

    store.addDislike = function (id) {
        async function asyncAddDislike(id) {
            const response = await api.addDislike(id);
            console.log("asyncAddDislike response: " + response);
            if (response.status === 200) {
                console.log(response.data);
                // storeReducer({
                //     type: GlobalStoreActionType.SET_CURRENT_LIST,
                //     payload: response.data.playlist
                // })
                store.loadIdNamePairs();
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncAddDislike(id);
    }

    store.clearAll = function () {
        storeReducer({
            type: GlobalStoreActionType.CLEAR,
            payload: null
        });
    }
    
    store.setEmptyIdPairs = function () {
        setStore((store) => ({...store, idNamePairs: []}));
    }

    store.searchUsername = function (username) {
        async function asyncSearchUsername(username) {
            const response = await api.searchUsername(username);
            if (response.status === 200) {
                console.log(response.data);
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncSearchUsername(username);
    }

    store.searchAll = function (search) {
        async function asyncSearchAll(search) {
            const response = await api.searchAll(search);
            if (response.status === 200) {
                console.log(response.data);
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncSearchAll(search);
    }

    store.searchPersonal = function (search) {
        async function asyncSearchAll(search) {
            const response = await api.searchPersonal(search);
            if (response.status === 200) {
                console.log(response.data);
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO ADD COMMENT");
            }
        }
        asyncSearchAll(search);
    }

    store.getPlaylistSongs = function (id) {
        async function asyncGetSongs(id) {
            const response = await api.getSongs(id);
            if (response.status === 200) {
                console.log(response.data);
                let playlist = response.data.songs;
                storeReducer({
                    type: GlobalStoreActionType.PLAY_PLAYLIST,
                    payload: playlist
                });
            }
            else {
                console.log("API FAILED TO GET SONGS");
            }
        }
        asyncGetSongs(id);
    }

    store.incSong = function () {
        let newSongIndex = store.currentPlayedSongIndex + 1;
        newSongIndex = newSongIndex % store.currentPlayed.songs.length;
        console.log(newSongIndex)   
        setStore((store) => ({...store, currentPlayedSongIndex: newSongIndex}));
    }

    store.decSong = function () {
        let newSongIndex = store.currentPlayedSongIndex - 1;
        newSongIndex = newSongIndex == -1 ? store.currentPlayed.songs.length -1 : newSongIndex;
        console.log(newSongIndex)
        setStore((store) => ({...store, currentPlayedSongIndex: newSongIndex}));
    }
    
    store.pauseVideoF = function () {
        setStore((store) => ({...store, playVideo: false}));
    }

    store.playVideoF = function () {
        setStore((store) => ({...store, playVideo: true}));
    }

    store.setSortMethod = function (method) {
        console.log(method)
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_METHOD,
            payload: method
        });
        store.loadIdNamePairs(method);
    }
    
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };