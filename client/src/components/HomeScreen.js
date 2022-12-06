import React, { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [searchMode, setSearchMode] = useState("personal");
    const [commentShown, setCommentShown] = useState(false);
    
    // what i added
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
  
    useEffect(() => {
        if(auth.guest){
            store.clearAll();
            setSearchMode("everything");
        }else{
            store.loadIdNamePairs();
        }
    }, []);

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setSearchMode(newAlignment);
        }
    };

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleAddComment(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            store.addComment(store.currentList._id, e.target.value);
            e.target.value = "";
        }
    }

    // what i added
    const handleSortByMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const sortByMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Sort1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Sort2</MenuItem>
        </Menu>
    );

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
                        setCommentShown={setCommentShown}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <ToggleButtonGroup style={{marginLeft: "40px"}}
                    color="primary"
                    value={searchMode}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    >
                    <ToggleButton value="personal"><HomeIcon /></ToggleButton>
                    <ToggleButton value="everything"><GroupsIcon /></ToggleButton>
                    <ToggleButton value="username"><PersonIcon /></ToggleButton>
                </ToggleButtonGroup>
                <TextField style={{marginLeft: "130px", width: "550px"}} id="outlined-basic" label="Search" variant="outlined" />
                <p style={{marginLeft: "120px", marginRight:"10px"}}>Sort By:</p>
                <ToggleButton 
                    size="medium"
                    edge="end"
                    aria-label="sort by menu"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleSortByMenuOpen}
                    color="primary"
                >
                    <MenuIcon></MenuIcon>
                </ToggleButton>
                {sortByMenu}
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
            <div id="list-selector-side">
                <div id="list-side-buttons">
                    <Button className='sideButtons' 
                        variant="outlined" sx={{ border: '1px solid black', color: 'black' }}
                        
                        >Player
                    </Button>
                    <Button className='sideButtons' 
                        disabled={store.currentList==null || store.currentList.published==""} 
                        variant="outlined" sx={{ border: '1px solid black', color: 'black' }} 
                        onClick={() => {setCommentShown(true)}}>
                            Comment
                    </Button>
                </div>
                <div id='list-side-content'>
                    {commentShown &&
                        <div style={{height: '100%', width: "100%"}}>
                            <List 
                                id="playlist-cards" 
                                sx={{ width: '100%', height: '87.1%', backgroundColor: "white", overflowWrap: "break-word", overflowY: "scroll"}}
                            >
                                {
                                    store.currentList.comments.map((comment, index) => (
                                        <div style={{ padding: '5px', backgroundColor: "grey", borderRadius: "25px"}}>
                                            <p>{comment.userName}</p>
                                            <p>{comment.comment}</p>
                                        </div>
                                    )) 
                                    // <div>

                                        
                                        // <p>I hate this song</p>
                                    // </div>
                                }
                            </List>
                            <TextField sx={{ width: '100%', position: "absolute", bottom: "0%", color: "black" }} id="filled-basic" label="Add comment" variant="filled" onKeyPress={handleAddComment}/>
                        </div>
                    }
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