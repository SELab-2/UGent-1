"use client";
import React from 'react'
import SchoolIcon from "@mui/icons-material/School";
import {Button} from "@mui/material";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];
const redirect_url = process.env['NEXT_PUBLIC_REDIRECT_URL'];

const CASButton = () => {
    /*
    * Button to login with CAS
    * */
    const handleCASLogin = (): void => {
        console.log('Login with CAS');
        window.location.href = backend_url + "/microsoft/to-auth-redirect?next=" + redirect_url + "/home"
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
