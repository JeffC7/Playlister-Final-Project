import { useContext, useRef, useEffect, useState } from 'react'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUILoginModal from './MUILoginModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth';
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
                // sx={{ width: '80%'}}
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
            </List>
        }
        { modalJSX }      
        </Box>
    )
}

export default WorkspaceScreen;