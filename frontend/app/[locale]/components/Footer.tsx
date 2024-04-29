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
                marginTop={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    height: 80,
                    marginX: 0,
                    position: 'static',
                    right: 0,
                    bottom: 0,
                    clear: 'both',
                    float: 'none'
                }}
            >
                <IconButton
                    sx={{width: 80, height: 80, padding: 0, margin: 0}}
                    href={'https://www.ugent.be/'}
                >
                    <Box
                        component="img"
                        src="/logo_UGent_EN_RGB_2400_white.png"
                        alt="logo"
                        style={{width: 80, height: 80}}
                    />
                </IconButton>
            </Box>
        )
    }
}

export default Footer;