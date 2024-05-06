import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import SubmitDetailsPage from './SubmitDetailsPage';
const i18nNamespaces = ['common']

export default async function Course({params: {locale, project_id}, searchParams: {token}}:
                                         { params: { locale: any, project_id: string }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const project_selected = false

    const desc_mock = "TODO: zet hier indieninstructies van het project, en misschien ook nog groepnummer, ook vorige indieningen een samenvatting ofzo"
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>

            <SubmitDetailsPage project_id={project_id}>

            </SubmitDetailsPage>

        </TranslationsProvider>
    )
}
