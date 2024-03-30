// components/ProfileEditButton.js
import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

const ProfileEditButton = () => {
    return (
        <Link href="/profile/edit" passHref>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
            >
                Edit account
            </Button>
        </Link>
    );
};

export default ProfileEditButton;
