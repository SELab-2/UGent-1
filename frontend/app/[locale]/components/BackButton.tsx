'use client'
import React from 'react';
import {Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
    destination: string;
    text: string;
}

// back button has to take the destination as a prop and navigate to it
export default function BackButton({destination, text}: BackButtonProps) {

    return (
        <Button
            variant={'contained'}
            color={'secondary'}
            href={destination}
            startIcon={<ArrowBackIcon />}
            sx={{
                width: 'fit-content',
                color: 'secondary.contrastText',
            }}
        >
            {text}
        </Button>
    );
}
