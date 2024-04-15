import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";

interface RemoveDialogProps {
    confirmRemove: boolean,
    handle_remove: () => void,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
}

function RemoveDialog({confirmRemove, handle_remove, setConfirmRemove, translations}: RemoveDialogProps) {
    return <div>
        <Dialog open={confirmRemove} className={"dialogPadding"}>
            <Box textAlign={"center"}>
                <DialogTitle>
                    {translations.t("remove_dialog")}
                </DialogTitle>
            </Box>
            <DialogContent>
                <Box textAlign={"center"} color={"grey"}>
                    {translations.t("action_dialog")}
                </Box>
            </DialogContent>
            <DialogActions style={{justifyContent: 'space-between'}}>
                <button
                    onClick={handle_remove}
                    className={"dialogRemove"}
                >
                    {translations.t("remove_confirm")}
                </button>
                <button
                    onClick={() => setConfirmRemove(false)}
                    className={"dialogCancel"}
                >
                    {translations.t("remove_cancel")}
                </button>
            </DialogActions>
        </Dialog>;
    </div>
}

export default RemoveDialog;