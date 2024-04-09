import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import React from "react";

function RemoveDialog(
    confirmRemove: boolean,
    handle_remove: () => void,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
) {
    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
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
            <DialogActions style={{ justifyContent: 'space-between'}}>
                    <button
                        onClick={handle_remove}
                        className={"dialogRemove"}
                    >
                        Remove
                    </button>
                    <button
                        onClick={() => setConfirmRemove(false)}
                        className={"dialogCancel"}
                    >
                        Cancel
                    </button>
            </DialogActions>
        </Dialog>;
    </TranslationsProvider>
}

export default RemoveDialog;