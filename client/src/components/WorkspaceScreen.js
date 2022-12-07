import { useContext, useRef, useEffect, useState } from 'react'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUILoginModal from './MUILoginModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [show, setShow] = useState(true);

    const modalClick = () => {
        setShow(false);
        auth.logoutUser();
    }

    function handleAddNewSong() {
        store.addNewSong();
    }


    let modalJSX = "";

    if(!auth.loggedIn) {
        return(<MUILoginModal show={show} setShow={modalClick}/>)

    }

    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    return (
        <Box>
        {auth.loggedIn && 
            <List 
                id="playlist-cards" 
                sx={{ width: '100%', marginLeft: '2vw'}}
            >
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))  
                }
                        <Grid
                            container
                            className="list-card unselected-list-card"
                            onClick={handleAddNewSong}
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            columnSpacing={2}
                        >

                            <Grid item>
                                <AddIcon fontSize='medium'/>
                            </Grid>
                        </Grid>
            </List>
        }   
        </Box>
    )
}

export default WorkspaceScreen;