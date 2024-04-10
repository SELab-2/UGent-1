import {Grid, IconButton} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function FinishButtons(
    visible: boolean,
    setVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    handleSave: () => Promise<void>,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; },
    course_id: number
) {
    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <Grid container spacing={0} alignItems={"center"} justifyContent={"space-between"}>
            <Grid display={"flex"}>
                {
                    visible ? (
                        <IconButton onClick={() => setVisible(!visible)}>
                            <VisibilityIcon/>
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => setVisible(!visible)}>
                            <VisibilityOffIcon/>
                        </IconButton>
                    )
                }
            </Grid>
            <Grid className={"buttonsGrid"}>
                <button
                    onClick={handleSave}
                    className={"saveButton"}
                >
                    {translations.t("save")}
                </button>
            </Grid>
            <Grid className={"buttonsGrid"}>
                <button
                    // TODO switch to correct URL
                    onClick={() => window.location.href = "/course/" + course_id + "/"}
                    className={"saveButton"}
                >
                    {translations.t("cancel")}
                </button>
            </Grid>
            <Grid className={"buttonsGrid"}>
                <button
                    onClick={() => setConfirmRemove(true)}
                    className={"removeButton"}
                >
                    {translations.t("remove")}
                </button>
            </Grid>
        </Grid>
    </TranslationsProvider>
}

export default FinishButtons;