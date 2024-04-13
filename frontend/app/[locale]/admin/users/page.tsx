import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import {getUsers} from '@lib/api';
 

const i18nNamespaces = ['common']

export default async function Users({params: {locale}}: { params: { locale: any} }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const headers = [t('name'), t('email'), t('role')]

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
                get={'users'}
                action_name={'remove'}
            />
            <Footer/>
        </TranslationsProvider>
    )
}