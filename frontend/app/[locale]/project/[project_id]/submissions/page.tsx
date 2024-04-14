import NavBar from "@app/[locale]/components/NavBar";
import initTranslations from "@app/i18n";
import React from "react";
import ListView from "@app/[locale]/components/ListView";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

const i18nNamespaces = ['common']

const SubmissionsPage = async ({params: {locale, project_id}}: {
    params: { locale: any, project_id: number }
}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces);

    const headers = ["Group number", "Submission date", "Status"]

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <ListView
                admin={false}
                headers={headers}
                get={'submissions'}
                get_id={project_id}
            />
        </TranslationsProvider>
    )
}

export default SubmissionsPage