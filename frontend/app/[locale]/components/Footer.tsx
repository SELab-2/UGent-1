import { AppBar, IconButton, Toolbar, Box } from "@mui/material";
import React from "react";
import Link from "next/link";


const Footer = () => {
    return(
        <Box sx={{
            color: 'primary.main',
            backgroundColor: 'primary.main',
            position: 'fixed',
            padding: 0,
            bottom: 0,
            marginLeft:-1,
            width: '100%',
            height: 60,
            display: 'flex',
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', left: 0, right: 0, color: 'primary.main', backgroundColor: 'primary.main'}}>
                <IconButton
                    sx={{width: 60, height: 60}}
                    href={'https://www.ugent.be/'}
                >
                    <Box
                        component="img"
                        src="/logo_UGent_EN_RGB_2400_white.png"
                        alt="logo"
                        style={{width: 75, height: 75}}
                    />
                </IconButton>
            </Toolbar>
        </Box>
    );
}

export default Footer;