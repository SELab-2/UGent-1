import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {Grid, TextField} from "@mui/material";

const group_info = `
    Here you can add the amount of groups and the group size.
    
    The amount of groups is the total amount of groups that will be created.
    The group size is the amount of students that will be in a group.
    
    If the group size is set to 1, the project will be individual and the amount of groups will be ignored.
`

function Groups(
    groupAmount: number,
    isGroupAmountEmpty: boolean,
    groupSize: number,
    isGroupSizeEmpty: boolean,
    setGroupAmount: (value: (((prevState: number) => number) | number)) => void,
    setGroupSize: (value: (((prevState: number) => number) | number)) => void,
) {
    const handleGroupAmountChange = (event: any) => {
        if (event.target.value === '') {
            setGroupAmount(event.target.value);
        } else if (event.target.value < 1) {
            setGroupAmount(1);
        } else if (event.target.value > 1000) {
            setGroupAmount(1000);
        } else if (event.target.value < 1000 || event.target.value >= 1) {
            setGroupAmount(event.target.value);
        }
    }

    const handleGroupSizeChange = (event: any) => {
        if (event.target.value === '') {
            setGroupSize(event.target.value);
        } else if (event.target.value < 1) {
            setGroupSize(1);
        } else if (event.target.value > 20) {
            setGroupSize(20);
        } else if (event.target.value < 20 || event.target.value >= 1) {
            setGroupSize(event.target.value);
        }
    }

    return <>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {"Groups"}
            <Tooltip title={
                <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                    {group_info.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </Typography>
            } placement={"right"}>
                <HelpOutlineIcon style={{fontSize: 'large', marginLeft: '5px'}}/>
            </Tooltip>
        </Typography>
        <Grid container spacing={1}>
            <Grid item xs={6} style={{margin: '0'}}>
                <Typography variant="body1" style={{margin: '0'}}>Amount of groups</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1">Group size</Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type="number"
                    inputProps={{min: 1, max: 1000}}
                    value={groupAmount}
                    onChange={handleGroupAmountChange}
                    style={{margin: '0px'}}
                    size="small"
                    error={isGroupAmountEmpty}
                    helperText={isGroupAmountEmpty ? "Amount of groups is required" : ""}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type="number"
                    inputProps={{min: 1, max: 20}}
                    value={groupSize}
                    onChange={handleGroupSizeChange}
                    style={{margin: '0px'}}
                    size="small"
                    error={isGroupSizeEmpty}
                    helperText={isGroupSizeEmpty ? "Group size is required" : ""}
                />
            </Grid>
        </Grid>
    </>;
}

export default Groups;