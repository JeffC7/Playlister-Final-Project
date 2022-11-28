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
import { fontSize } from '@mui/system';
import WorkspaceScreen from './WorkspaceScreen';


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
    const { idNamePair, selected } = props;

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

    function handleAddComment(event, id){
        event.stopPropagation();
        store.addComment(id, "UDYR sucks after reworks");
    }

    function openCurrentList(event, id){
        store.setCurrentList(id);
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
            style={{ width: '100%', fontSize: '20pt', border: '1px solid black', backgroundColor: 'Grey', borderRadius: "25px", marginBottom: "1vh" }}
            button
            // onClick={(event) => {
            //     handleLoadList(event, idNamePair._id)
            // }}
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
                            <h3 style={{margin: "0", fontSize: '20pt'}}>{idNamePair.name}</h3>
                        </Grid>
                        <IconButton onClick={(event) => {}}>
                            <ThumbDownIcon style={{marginTop: "10pt", height: "100%"}} fontSize="small" />
                        </IconButton>
                        <IconButton onClick={(event) => {}}>
                            <ThumbUpAltIcon style={{marginTop: "10pt", height: "100%"}}  />
                        </IconButton>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item padding="0" xs={2} fontSize="small">
                            <p style={{margin: "0", fontSize: '8pt'}}>By: </p>
                        </Grid>
                    </Grid>
                    {listOpened && store.currentList._id == idNamePair._id &&
                       <WorkspaceScreen />
                    }
                    <Grid container item spacing={3}>
                        <Grid item xs={6}>
                            <p style={{height: "100%", fontSize: '8pt'}}>Published: </p>
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