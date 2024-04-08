import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";

function RemoveDialog(confirmRemove: boolean, handle_remove: () => void, setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    return <Dialog open={confirmRemove} style={{padding: '10px'}}>
        <Box textAlign={"center"}>
            <DialogTitle>
                Remove this project?
            </DialogTitle>
        </Box>
        <DialogContent>
            <Box textAlign={"center"} color={"grey"}>
                This action cannot be undone
            </Box>
        </DialogContent>
        <DialogActions>
            <Box textAlign={"center"} gap={2}>
                <button
                    onClick={handle_remove}
                    style={{
                        backgroundColor: '#D0E4FF',
                        padding: '15px 30px',
                        marginLeft: '15px',
                        marginBottom: '15px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    }}
                >
                    Remove
                </button>
                <button
                    onClick={() => setConfirmRemove(false)}
                    style={{
                        backgroundColor: '#D0E4FF',
                        padding: '15px 30px ',
                        marginLeft: '30px',
                        marginRight: '15px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    }}
                >
                    Cancel
                </button>
            </Box>
        </DialogActions>
    </Dialog>;
}

export default RemoveDialog;