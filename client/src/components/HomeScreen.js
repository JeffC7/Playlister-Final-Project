import React, { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [searchMode, setSearchMode] = useState("personal");

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleChange = (event, newAlignment) => {
        setSearchMode(newAlignment);
    };

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <ToggleButtonGroup
                    color="primary"
                    value={searchMode}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    >
                    <ToggleButton value="personal" style={{outlineWidth: '0'}}><HomeIcon /></ToggleButton>
                    <ToggleButton value="everything"><GroupsIcon /></ToggleButton>
                    <ToggleButton value="username"><PersonIcon /></ToggleButton>
                </ToggleButtonGroup>
                <TextField id="outlined-basic" label="Search" variant="outlined" />
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
            <div id="list-selector-side">
                <div id="list-side-buttons">
                    <Button className='sideButtons' variant="outlined"  sx={{ border: '1px solid black', color: 'black' }}>Player</Button>
                    <Button className='sideButtons' disabled variant="outlined" sx={{ border: '1px solid black', color: 'black' }}>Comment</Button>
                </div>
                <div id='list-side-content'>

                </div>
            </div>
            <div id="list-selector-footing">
                <IconButton size="large" onClick={handleCreateNewList}>
                    <AddIcon fontSize="large" />
                </IconButton>
                <Typography variant="h4">Your Lists</Typography>
            </div>
        </div>)
}

export default HomeScreen;