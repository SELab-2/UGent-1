import React from 'react';

import NavBar from "@/app/components/NavBar";
import Box from "@mui/material/Box";

const HomePage = () => {
    return (
        <div>
            <NavBar />
            <Box sx={{marginTop: '64px'}}>
                <h1>Home</h1>
            </Box>
        </div>
    )
}

export default HomePage