import React from 'react';
import Box from '@mui/material/Box';
import NavBar from "../../components/NavBar";
import ProfileEditCard from "@app/[locale]/components/ProfileEditCard";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";

const EditProfilePage = async ({params: {locale}}: { params: { locale: any } }) => {
    const {t, resources} = await initTranslations(locale, ['common'])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box sx={{pt: 9}}>
                <ProfileEditCard/>
            </Box>
        </TranslationsProvider>
    );
};

export default EditProfilePage;
