import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
 

const i18nNamespaces = ['common']

export default async function Users({params: {locale}}: { params: { locale: any} }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const headers = [t('name'), t('description')]

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <ListView
                admin={true}
                headers={headers}
                get={'courses'}
                action_name={'join_course'}
            />
            <Footer/>
        </TranslationsProvider>
    )
}