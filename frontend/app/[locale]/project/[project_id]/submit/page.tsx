import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import SubmitDetailsPage from '@app/[locale]/components/SubmitDetailsPage';
const i18nNamespaces = ['common']

export default async function Course({params: {locale, project_id}, searchParams: {token}}:
                                         { params: { locale: any, project_id: string }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>

            <SubmitDetailsPage locale={locale} project_id={project_id}>

            </SubmitDetailsPage>

        </TranslationsProvider>
    )
}
