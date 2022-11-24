import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIAccountErrorModal(props) {
    const { store } = useContext(GlobalStoreContext);
    function handleCloseModal(event) {
        store.hideAccountErrorModal();
    }

    return (
        <Modal
            open={store.isAccountErrorModalOpen()}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <Alert severity="warning">{props.msg}</Alert>
                <div id="confirm-cancel-container">
                    <button
                        id="cancel-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Close</button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}