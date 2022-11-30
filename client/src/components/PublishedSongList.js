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
import { fontWeight } from '@mui/system'

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PublishedSongList({published}) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [show, setShow] = useState(true);

    return (
        <Box>
            <List 
                id="playlist-cards" 
                sx={{ width: '100%', marginLeft: '2vw', borderRadius: "25px", backgroundColor: "white"}}
            >
                {
                    store.currentList.songs.map((song, index) => (
                        <p style={{marginLeft: "15px", fontWeight: "bold"}}>{index+1}. {song.title}</p>
                    ))  
                }
            </List>
        </Box>
    )
}

export default PublishedSongList;