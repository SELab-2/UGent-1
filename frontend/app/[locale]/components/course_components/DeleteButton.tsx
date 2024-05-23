'use client';

import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { deleteCourse } from "@lib/api";
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

interface DeleteButtonProps {
    courseId: number
}

const DeleteButton = ({ courseId }: DeleteButtonProps) => {
    /*
    * This component displays the delete button for a course.
    * @param courseId: The id of the course
    */
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await deleteCourse(courseId);
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
                {t("delete course")}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("Are you sure you want to delete this course?")}</DialogTitle>
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
