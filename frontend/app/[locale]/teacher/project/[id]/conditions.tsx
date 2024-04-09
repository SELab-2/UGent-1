import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function Conditions(
    conditions: string[],
    setConditions: (value: (((prevState: string[]) => string[]) | string[])) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
) {
    const handleConditionsChange = (index: number, event: any) => {
        const newConditions = [...conditions];
        newConditions[index] = event.target.value;
        setConditions(newConditions);

        if (index === conditions.length - 1 && event.target.value !== '') {
            setConditions([...newConditions, '']);
        } else if (event.target.value === '' && index < conditions.length - 1) {
            newConditions.splice(index, 1);
            setConditions(newConditions);
        }
    }

    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {translations.t("conditions")}
            <Tooltip title={
                <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                    {translations.t("conditions_info").split('\n').map((line: string, index: number) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </Typography>
            } placement={"right"}>
                <HelpOutlineIcon style={{fontSize: 'large', marginLeft: '5px'}}/>
            </Tooltip>
        </Typography>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',

        }}>
            {conditions.map((condition, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    sx={{width: '100%', marginBottom: '10px'}}
                    value={condition}
                    onChange={(event) => handleConditionsChange(index, event)}
                    margin={'normal'}
                    size="small"
                />
            ))}
        </Box>
    </TranslationsProvider>;
}

export default Conditions;