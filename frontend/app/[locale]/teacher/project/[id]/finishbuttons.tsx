import {Grid, IconButton} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";

function FinishButtons(
    visible: boolean,
    setVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    handleSave: () => Promise<void>,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void
) {
    return <Grid container spacing={1} alignItems={"center"} justifyContent={"space-between"}>
        <Grid display={"flex"}>
            {
                visible ? (
                    <IconButton onClick={() => setVisible(!visible)}>
                        <VisibilityIcon/>
                    </IconButton>
                ) : (
                    <IconButton onClick={() => setVisible(!visible)}>
                        <VisibilityOffIcon/>
                    </IconButton>
                )
            }
        </Grid>
        <Grid style={{padding: '10px'}}>
            <button
                onClick={handleSave}
                style={{
                    backgroundColor: '#D0E4FF',
                    padding: '5px 30px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                }}
            >
                Save
            </button>
        </Grid>
        <Grid style={{padding: '10px'}}>
            <button
                // TODO switch to correct URL
                onClick={() => window.location.href = "/home"}
                style={{
                    backgroundColor: '#D0E4FF',
                    padding: '5px 30px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                }}
            >
                Cancel
            </button>
        </Grid>
        <Grid style={{padding: '10px'}}>
            <button
                onClick={() => setConfirmRemove(true)}
                style={{
                    backgroundColor: '#E15E5E',
                    padding: '5px 30px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    color: 'white'
                }}
            >
                Remove
            </button>
        </Grid>
    </Grid>;
}

export default FinishButtons;