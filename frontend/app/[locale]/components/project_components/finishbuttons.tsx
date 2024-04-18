import {Grid, IconButton} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';

interface FinishButtonsProps {
    visible: boolean,
    setVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    handleSave: () => Promise<void>,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; },
    course_id: number,
    setHasDeadline: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    hasDeadline: boolean
}

function FinishButtons(
    {
        visible, setVisible, handleSave, setConfirmRemove, translations,
        course_id, setHasDeadline, hasDeadline
    }: FinishButtonsProps
) {
    return <div>
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
            <Grid display={"flex"}>
                {
                    hasDeadline ? (
                        <IconButton onClick={() => setHasDeadline(!hasDeadline)}>
                            <AlarmOnIcon/>
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => setHasDeadline(!hasDeadline)}>
                            <AlarmOffIcon/>
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
    </div>
}

export default FinishButtons;