import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import ItemsList from "@app/[locale]/components/general/ItemsList";

interface ConditionsProps {
    conditions: string[],
    setConditions: (value: (((prevState: string[]) => string[]) | string[])) => void,
}

function Conditions({conditions, setConditions}: ConditionsProps) {
    const {t} = useTranslation();

    console.log(conditions)

    return <div>
        <Typography variant="h5" className={"typographyStyle"}>
            {t("conditions")}
            <Tooltip title={
                <Typography variant="body1" className={"conditionsText"}>
                    {t("conditions_info").split('\n').map((line: string, index: number) => (
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
            <ItemsList
                items={conditions}
                setItems={setConditions}
                input_placeholder={t("conditions_example")}
                empty_list_placeholder={t("no_conditions")}
                button_text={t("add")}
            />
        </Box>
    </div>;
}

export default Conditions;