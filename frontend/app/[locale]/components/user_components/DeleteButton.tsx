'use client';

import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { deleteUser } from "@lib/api";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

interface DeleteButtonProps {
    userId: number
}

const DeleteButton = ({ userId }: DeleteButtonProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await deleteUser(userId);
        window.location.href = "/home";
    };

    return (
        <>
            <Button
                variant='contained'
                onClick={handleOpen}
                color='error'
                sx={{
                    width: 'fit-content',
                    height: 'fit-content',
                    whiteSpace: 'nowrap',
                }}
            >
                {t("delete user")}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("Are you sure you want to delete this user?")}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t("cancel")}
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        {t("delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteButton;
