import React from 'react';
import NavBar from "../components/NavBar";
import Typeography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";

async function HomePage({params: {locale}}) {
    const {t} = await initTranslations(locale, ['common']);
    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '64px'}}>
                <Typeography variant="h3">
                    {t("courses")}
                </Typeography>
            </Box>
        </div>
    )
}

export default HomePage