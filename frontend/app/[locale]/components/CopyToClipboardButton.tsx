"use client"
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {IconButton, Snackbar, Tooltip} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CopyToClipboardButtonProps {
    text: string;
}

const CopyToClipboardButton = ({text}: CopyToClipboardButtonProps) => {
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Tooltip title={t("copy")}>
                <IconButton onClick={handleClick} color="primary">
                    <ContentCopyIcon/>
                </IconButton>
            </Tooltip>
            <Snackbar
                message={t("copied_to_clipboard")}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};

export default CopyToClipboardButton;