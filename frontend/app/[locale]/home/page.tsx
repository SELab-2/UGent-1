import React from 'react';
import initTranslations from "../../i18n";
import NavBar from '../components/NavBar';
import TranslationsProvider from "../components/TranslationsProvider";
import YearStateComponent from "@app/[locale]/components/project_components/YearStateComponent";

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
