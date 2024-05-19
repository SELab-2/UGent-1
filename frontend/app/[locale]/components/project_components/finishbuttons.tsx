import {Grid, IconButton, Button, Typography, Tooltip} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import {useTranslation} from "react-i18next";

interface FinishButtonsProps {
    visible: boolean,
    setVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    handleSave: () => Promise<void>,
    setConfirmRemove: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    project_id: number,
    setHasDeadline: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    hasDeadline: boolean,
    createProject: boolean,
}

function FinishButtons(
    {
        visible, setVisible, handleSave, setConfirmRemove,
        project_id, setHasDeadline, hasDeadline, createProject
    }: FinishButtonsProps
) {
    const {t} = useTranslation();
    return <div>
        <Grid container spacing={0} alignItems={"center"} justifyContent={"space-between"}>
            <Grid display={"flex"}>
                {
                    visible ? (
                        <Tooltip title={t("visibility")} placement={"top"}>
                            <IconButton onClick={() => setVisible(!visible)}>
                                <VisibilityIcon/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t("visibility")} placement={"top"}>
                            <IconButton onClick={() => setVisible(!visible)}>
                                <VisibilityOffIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Grid>
            <Grid display={"flex"}>
                {
                    hasDeadline ? (
                        <Tooltip title={t("has_deadline")} placement={"top"}>
                            <IconButton onClick={() => setHasDeadline(!hasDeadline)}>
                                <AlarmOnIcon/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t("has_deadline")} placement={"top"}>
                            <IconButton onClick={() => setHasDeadline(!hasDeadline)}>
                                <AlarmOffIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Grid>
            <Grid className={"buttonsGrid"}>
                <Button
                    onClick={handleSave}
                    className={"saveButton"}
                    variant={'contained'}
                    color={'primary'}
                    sx={{
                        width: 'fit-content',
                        color: 'primary.contrastText',
                    }}
                >
                    <Typography>
                        {createProject ? t("create") : t("save")}
                    </Typography>
                </Button>
            </Grid>
            <Grid className={"buttonsGrid"}>
                <Button
                    onClick={() => window.location.href = "/project/" + project_id + "/"}
                    className={"saveButton"}
                    variant={'contained'}
                    color={'secondary'}
                    sx={{
                        width: 'fit-content',
                        color: 'secondary.contrastText',
                    }}
                >
                    <Typography>
                        {t("cancel")}
                    </Typography>
                </Button>
            </Grid>
            {!createProject && (
                <Grid className={"buttonsGrid"}>
                    <Button
                        onClick={() => setConfirmRemove(true)}
                        className={"removeButton"}
                        variant={'contained'}
                        color={'error'}
                        sx={{
                            width: 'fit-content',
                        }}
                    >
                        <Typography>
                            {t("remove")}
                        </Typography>
                    </Button>
                </Grid>
            )}
        </Grid>
    </div>
}

export default FinishButtons;