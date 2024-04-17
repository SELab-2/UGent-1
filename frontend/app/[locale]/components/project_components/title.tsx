import {Grid, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

interface TitleProps {
    isTitleEmpty: boolean,
    setTitle: (value: (((prevState: string) => string) | string)) => void,
    title: string,
    score: number,
    isScoreEmpty: boolean,
    setScore: (value: (((prevState: number) => number) | number)) => void,
    translations: { t: any, resources: any, locale: any, i18nNamespaces: any },
}

function Title({isTitleEmpty, setTitle, title, score, isScoreEmpty, setScore, translations}: TitleProps) {
    const handleScoreChange = (event: any) => {
        if (event.target.value === '') {
            setScore(event.target.value);
        } else if (event.target.value < 1) {
            setScore(1);
        } else if (event.target.value > 100) {
            setScore(100);
        } else if (event.target.value < 100 || event.target.value >= 1) {
            setScore(event.target.value);
        }
    }

    return <Grid container spacing={1}>
        <Grid item xs={6} className={"titleGrids"}>
            <Typography variant="h5" className={"typographyStyle"}>
                {translations.t("title")}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5" className={"typographyStyle"}>
                {translations.t("max_score")}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <TextField
                variant="outlined"
                error={isTitleEmpty}
                onChange={(event) => setTitle(event.target.value)}
                value={title}
                className={"titleGrids"}
                helperText={isTitleEmpty ? translations.t("title_required") : ""}
                size="small"
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                type="number"
                variant="outlined"
                inputProps={{min: 1, max: 100}}
                value={score}
                onChange={handleScoreChange}
                className={"titleGrids"}
                size="small"
                error={isScoreEmpty}
                helperText={isScoreEmpty ? translations.t("score_required") : ""}
            />
        </Grid>
    </Grid>
}

export default Title;
