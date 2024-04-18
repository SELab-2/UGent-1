import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";

interface ConditionsProps {
    conditions: string[],
    setConditions: (value: (((prevState: string[]) => string[]) | string[])) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
}

function Conditions({conditions, setConditions, translations}: ConditionsProps) {
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

    return <div>
        <Typography variant="h5" className={"typographyStyle"}>
            {translations.t("conditions")}
            <Tooltip title={
                <Typography variant="body1" className={"conditionsText"}>
                    {translations.t("conditions_info").split('\n').map((line: string, index: number) => (
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
        <Box className={"conditionsBox"}>
            {conditions.map((condition, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    className={"conditionsSummation"}
                    value={condition}
                    onChange={(event) => handleConditionsChange(index, event)}
                    margin={'normal'}
                    size="small"
                />
            ))}
        </Box>
    </div>;
}

export default Conditions;