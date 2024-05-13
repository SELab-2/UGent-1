'use client';

import React from 'react'
import {useTranslation} from "react-i18next";
import {deleteUser} from "@lib/api";
import {Button} from '@mui/material';



interface EditUserFormProps {
    userId: number
}

const DeleteButton = ({userId}: EditUserFormProps) => {
    const {t} = useTranslation()

    const handleDelete = async () => {
        await deleteUser(userId)
        window.location.href = "/home";
    }

    return (
        <Button
            variant='contained'
            onClick={handleDelete}
            color='error'
            sx={{
                width: 'fit-content',
                height: 'fit-content',
                whiteSpace: 'nowrap',
            }}
        >
            {t("delete user")}
        </Button>
    )
}

export default DeleteButton