import {IconButton, Toolbar, Box} from "@mui/material";
import React from "react";


const Footer = () => {
    return (
        <Toolbar sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'space-between',
            color: 'primary.main',
            backgroundColor: 'primary.main',
            height: 60,
            width: "100%",
            marginX: 0,
            position: 'fixed',
            bottom: 0,
            left: 0,
        }}>
            <IconButton
                sx={{width: 60, height: 60, padding: 0, margin: 0}}
                href={'https://www.ugent.be/'}
            >
                <Box
                    component="img"
                    src="/logo_UGent_EN_RGB_2400_white.png"
                    alt="logo"
                    style={{width: 60, height: 60}}
                />
            </IconButton>
        </Toolbar>
    );
}

export default Footer;