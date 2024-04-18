import {IconButton, Toolbar, Box} from "@mui/material";
import React from "react";

const test: boolean = true;


const Footer = () => {
    if (test) {
        return (
            <Box
                width={"100vw"}
                bottom={0}
                left={0}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    height: 60,
                    marginX: 0,
                    marginTop: "100vh",
                    position: 'fixed',
                    right: 0,
                    bottom: 0,
                    clear: 'both',
                }}
            >
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
            </Box>
        )
    }

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
            position: 'static',
            bottom: -1,
            left: -5,
        }}
        >
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