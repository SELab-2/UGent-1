'use client'
import React from 'react';
import { styled } from '@mui/system';

const backButtonStyle = {
    marginTop: '80px',
    marginLeft: '20px',
    alignSelf: 'flex-end', 
    fontSize: '1.4rem', 
    minWidth: 'auto',
    width: 'auto',
};

// Define the BackButton as a styled button
const BackButton_ = styled('button')(({theme}) => ({
    ...backButtonStyle,
    backgroundColor: theme.palette.secondary.main,
    color:  theme.palette.secondary.contrastText,
    border: '1px solid #000',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

// back button has to take the destination as a prop and navigate to it
export default function BackButton({ destination }) {
    const handleClick = () => {
        window.location.assign(destination);
    };

    return (
        <BackButton_ onClick={handleClick}>
            Back to {destination.slice(1)} page
        </BackButton_>
    );
}
