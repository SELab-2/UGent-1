import React from 'react';
import initTranslations from "@app/i18n";
import NavBar from '@app/[locale]/components/NavBar';
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import YearStateComponent from "@app/[locale]/components/YearStateComponent";

const HomePage = async ({params: {locale}}: { params: { locale: any } }) => {
    const {t, resources} = await initTranslations(locale, ['common'])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <YearStateComponent/>
        </TranslationsProvider>
    );
};

export default HomePage;
