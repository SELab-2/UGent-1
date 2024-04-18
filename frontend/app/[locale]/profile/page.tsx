import React from 'react';
import ProfileCard from '../components/ProfileCard';
import NavBar from '../components/NavBar';
import Box from '@mui/material/Box';
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";

const ProfilePage = async ({params: {locale}}: { params: { locale: any } }) => {
    const {t, resources} = await initTranslations(locale, ['common'])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box sx={{pt: 9}}>
                <ProfileCard/>
            </Box>
        </TranslationsProvider>
    );
};

export default ProfilePage;
