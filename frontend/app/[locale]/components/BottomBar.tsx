import React from 'react';
import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import Image from "next/image";
import logo from "../../../public/logo_ugent_horizontal_transparent.png";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

const BottomBar = () => {
    return (
        <AppBar position="fixed" style={{bottom: 0, top: 'auto'}}>
            <Toolbar sx={{justifyContent: 'space-between', left: 0, right: 0}}>
                <Image src={logo} alt={"Universiteit Gent"} width={150} height={45}/>
                <Box display="flex" justifyContent="flex-end" style={{padding: '10px'}} sx={{gap: 2}}>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Contact
                    </Typography>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Privacy
                    </Typography>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Version 0.0.1
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default BottomBar;
