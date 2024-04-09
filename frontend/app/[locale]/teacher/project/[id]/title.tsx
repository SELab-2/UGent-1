import {Grid, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function Title(
    isTitleEmpty: boolean,
    setTitle: (value: (((prevState: string) => string) | string)) => void,
    title: string, score: number,
    isScoreEmpty: boolean,
    setScore: (value: (((prevState: number) => number) | number)) => void,
    translations: {t: any, resources: any, locale: any, i18nNamespaces: any},
) {
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

    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <Grid container spacing={1}>
            <Grid item xs={6} style={{margin: '0'}}>
                <Typography variant="h5"
                    style={{
                        fontWeight: 'bold',
                        fontFamily: 'Inter',
                        padding: '0',
                        margin: '0 0 5px 0'
                    }}>
                    {translations.t("title")}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5"
                            style={{
                                fontWeight: 'bold',
                                fontFamily: 'Inter',
                                padding: '0',
                                margin: '0 0 5px 0'
                            }}>
                    {translations.t("max_score")}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    sx={{width: '100%', padding: '0', margin: '0'}}
                    error={isTitleEmpty}
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
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
                    style={{margin: '0px'}}
                    sx={{width: '100%', padding: '0', margin: '0'}}
                    size="small"
                    error={isScoreEmpty}
                    helperText={isScoreEmpty ? translations.t("score_required") : ""}
                />
            </Grid>
        </Grid>
    </TranslationsProvider>;
}

export default Title;
