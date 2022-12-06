import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';
import Grid from '@mui/material/Grid';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { fontSize } from '@mui/system';
import WorkspaceScreen from './WorkspaceScreen';
import Button from '@mui/material/Button'
import PublishedSongList from './PublishedSongList';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [listOpened, setListOpened] = useState(false);
    const { idNamePair, selected, setCommentShown } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }
    
    useEffect(() => {
        if(store.currentList){
            setListOpened(true);
        }
    
    }, [store]);

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handlePublish(event, id){
        event.stopPropagation();
        store.publish(id);
    }

    function handleDuplicate(event, id){
        event.stopPropagation();
        store.duplicatePlaylist(id);
    }

    function openCurrentList(event, id){
        store.setCurrentList(id);
        setCommentShown(false);
    }

    function closeCurrentList(event){
        setListOpened(false);
        store.closeCurrentList();
        setCommentShown(false);
        // store.closeCurrentList();
    }

    function addLike(event, id){
        event.stopPropagation();
        store.addLike(id);
    }

    function addDislike(event, id){
        event.stopPropagation();
        store.addDislike(id);
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '20pt', border: '1px solid black', backgroundColor: 'lightBlue', borderRadius: "25px", marginBottom: "1vh" }}
            button
            onClick={(event) => {
                event.stopPropagation();
                store.getPlaylistSongs(idNamePair._id);
            }}
        >
            {/* <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box> */}
            {/* <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleAddComment(event, idNamePair._id)
                    }} aria-label='edit'>
                    <CommentIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDuplicate(event, idNamePair._id)
                    }} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt', backgroundColor: 'green'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handlePublish(event, idNamePair._id)
                    }} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box> */}
            {/* <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box> */}
                <Grid container rowSpacing={0} columnSpacing={{ xs: 1 }}>
                    <Grid container item spacing={3} top="0%">
                        <Grid item xs={9} fontSize="small">
                            <h3 style={{margin: "0px 10px", fontSize: '20pt'}}>{idNamePair.name}</h3>
                        </Grid>
                        {idNamePair.published!= "" &&
                            <IconButton onClick={(event) => {
                                                    addLike(event, idNamePair._id)
                                                }}>
                                <ThumbUpAltIcon style={{marginTop: "10pt", height: "100%"}} />
                            </IconButton>
                        }
                        {idNamePair.published!= "" &&
                            <p>{idNamePair.likes}</p>
                        }
                        {idNamePair.published!= "" &&
                            <IconButton onClick={(event) => {
                                                    addDislike(event, idNamePair._id)
                                                }}>
                                <ThumbDownIcon style={{marginTop: "10pt", height: "100%"}} fontSize="medium"  />
                            </IconButton>
                        }
                        {idNamePair.published!= "" &&
                            <p>{idNamePair.dislikes}</p>
                        }
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item padding="0" xs={2} fontSize="small">
                            <p style={{margin: "0px 10px", fontSize: '8pt'}}>By: {idNamePair.userName}</p>
                        </Grid>
                    </Grid>
                    {listOpened && store.currentList !== null && store.currentList._id == idNamePair._id &&
                        <Grid container item>
                            <Grid item padding="0" xs={10} fontSize="15pt">
                                {store.currentList.published === "" &&
                                    <WorkspaceScreen />
                                }
                                {store.currentList.published != "" &&
                                    <PublishedSongList/>
                                }
                            </Grid>

                        </Grid>
                    }
                    {listOpened && store.currentList !== null && store.currentList._id == idNamePair._id &&
                        <Grid container item spacing={5}>
                            {store.currentList.published === "" &&
                            <Grid item xs={2} display="flex" justifyContent="end">
                                <Button 
                                    disabled={!store.canUndo()}
                                    id='add-song-button'
                                    onClick={handleUndo}
                                    className='sideButtons' 
                                    variant="outlined"  
                                    sx={{ border: '1px solid black', color: 'black', backgroundColor: 'white' }}>Undo</Button>
                            </Grid>
                            }
                            {store.currentList.published === "" &&
                            <Grid item xs={1} display="flex" justifyContent="end">
                                    <Button 
                                    disabled={!store.canRedo()}
                                    id='redo-button'
                                    onClick={handleRedo} 
                                    className='sideButtons' 
                                    variant="outlined"  
                                    sx={{ border: '1px solid black', color: 'black', backgroundColor: 'white'  }} >Redo</Button>
                            </Grid>
                            }
                            {store.currentList.published === "" &&
                            <Grid item xs={5} display="flex" justifyContent="end">
                                <Button onClick={(event) => {
                                            handlePublish(event, idNamePair._id)
                                        }} 
                                        className='sideButtons' variant="outlined"  sx={{ border: '1px solid black', color: 'black', backgroundColor: 'white'  }}>
                                            Publish
                                </Button>
                            </Grid>
                            }
                            <Grid item xs={1} display="flex" justifyContent="start">
                                <Button onClick={(event) => {
                                            handleDeleteList(event, idNamePair._id)
                                        }} 
                                        className='sideButtons' variant="outlined"  sx={{ border: '1px solid black', color: 'black', backgroundColor: 'white'  }}>Delete
                                </Button>
                            </Grid>
                            <Grid item xs={2} display="flex" justifyContent="start">
                                <Button onClick={(event) => {
                                            handleDuplicate(event, idNamePair._id)
                                        }} 
                                        className='sideButtons' variant="outlined"  sx={{ border: '1px solid black', color: 'black', backgroundColor: 'white'  }}>
                                            Duplicate
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {listOpened && store.currentList !== null && store.currentList._id == idNamePair._id &&
                        <Grid container item spacing={1}>
                            <Grid item xs={11.64} display="flex" justifyContent="end">
                                <IconButton style={{height: "100%"}} onClick={(event) => { closeCurrentList(event)}}>
                                    <KeyboardDoubleArrowUpIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    }
                    {!(listOpened && store.currentList !== null && store.currentList._id == idNamePair._id) &&
                    <Grid container item spacing={3}>
                        <Grid item xs={6}>
                            <p style={{marginLeft: "10px", height: "100%", fontSize: '8pt'}}>Published: {idNamePair.published}</p>
                        </Grid>
                        <Grid item xs={4} fontSize="small">
                            <p style={{height: "100%", fontSize: '8pt'}}>Listens: </p>
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
                            <IconButton style={{height: "100%"}} onClick={(event) => { openCurrentList(event, idNamePair._id)}}>
                                <KeyboardDoubleArrowDownIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    }
                </Grid>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;