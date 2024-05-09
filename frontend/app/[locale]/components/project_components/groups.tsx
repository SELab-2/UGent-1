import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {Grid, TextField} from "@mui/material";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {useTranslation} from "react-i18next";

interface GroupsProps {
    groupAmount: number,
    isGroupAmountEmpty: boolean,
    groupSize: number,
    isGroupSizeEmpty: boolean,
    setGroupAmount: (value: (((prevState: number) => number) | number)) => void,
    setGroupSize: (value: (((prevState: number) => number) | number)) => void,
}

function Groups(
    {
        groupAmount,
        isGroupAmountEmpty,
        groupSize,
        isGroupSizeEmpty,
        setGroupAmount,
        setGroupSize,
    }: GroupsProps
) {
    const {t} = useTranslation();
    const handleGroupAmountChange = (event: any) => {
        if (event.target.value === '') {
            setGroupAmount(event.target.value);
        } else if (event.target.value < 1) {
            setGroupAmount(1);
        } else if (event.target.value > 1000) {
            setGroupAmount(1000);
        } else if (event.target.value < 1000 || event.target.value >= 1) {
            setGroupAmount(event.target.value);
        }
    }

    const handleGroupSizeChange = (event: any) => {
        if (event.target.value === '') {
            setGroupSize(event.target.value);
        } else if (event.target.value < 1) {
            setGroupSize(1);
        } else if (event.target.value > 20) {
            setGroupSize(20);
        } else if (event.target.value < 20 || event.target.value >= 1) {
            setGroupSize(event.target.value);
        }
    }

    return (
        <div>
            <Typography variant="h5" className={"typographyStyle"}>
                {t("groups")}
                <Tooltip title={
                    <Typography variant="body1" className={"conditionsText"}>
                        {t("group_info").split('\n').map((line: string, index: number) => (
                            <React.Fragment key={index}>
                                {line}
                                <br/>
                            </React.Fragment>
                        ))}
                    </Typography>
                } placement={"right"}>
                    <HelpOutlineIcon className={"conditionsHelp"}/>
                </Tooltip>
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={6} className={"titleGrids"}>
                    <Typography variant="body1" className={"titleGrids"}>{t("group_amount")}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">{t("group_size")}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        type="number"
                        inputProps={{min: 1, max: 1000}}
                        value={groupAmount}
                        onChange={handleGroupAmountChange}
                        className={"titleGrids"}
                        size="small"
                        error={isGroupAmountEmpty}
                        helperText={isGroupAmountEmpty ? t("group_amount_required") : ""}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        type="number"
                        inputProps={{min: 1, max: 20}}
                        value={groupSize}
                        onChange={handleGroupSizeChange}
                        className={"titleGrids"}
                        size="small"
                        error={isGroupSizeEmpty}
                        helperText={isGroupSizeEmpty ? t("group_size_required") : ""}
                    />
                </Grid>
            </Grid>
        </div>
        );
}

export default Groups;