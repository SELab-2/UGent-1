"use client";
import React from 'react'
import SchoolIcon from "@mui/icons-material/School";
import {Button} from "@mui/material";

const CASButton = () => {
    const handleCASLogin = (): void => {
        // Implement CAS login logic here
        console.log('Login with CAS');
        window.location.href = "http://localhost:8000/microsoft/to-auth-redirect?next=/redirect/homepage"
    };

    return (
        <div>
            <Button
                onClick={handleCASLogin}
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<SchoolIcon/>}
            >
                Login with CAS
            </Button>
        </div>
    )
}

export default CASButton
