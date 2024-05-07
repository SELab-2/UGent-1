import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

interface RemoveDialogProps {
    confirmRemove: boolean,
    handle_remove: () => void,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
}

function RemoveDialog({confirmRemove, handle_remove, setConfirmRemove}: RemoveDialogProps) {
    const {t} = useTranslation();

    return <div>
        <Dialog open={confirmRemove} className={"dialogPadding"}>
            <Box textAlign={"center"}>
                <DialogTitle>
                    {t("remove_dialog")}
                </DialogTitle>
            </Box>
            <DialogContent>
                <Box textAlign={"center"} color={"grey"}>
                    {t("action_dialog")}
                </Box>
            </DialogContent>
            <DialogActions style={{justifyContent: 'space-between'}}>
                <button
                    onClick={handle_remove}
                    className={"dialogRemove"}
                >
                    {t("remove_confirm")}
                </button>
                <button
                    onClick={() => setConfirmRemove(false)}
                    className={"dialogCancel"}
                >
                    {t("remove_cancel")}
                </button>
            </DialogActions>
        </Dialog>;
    </div>
}

export default RemoveDialog;