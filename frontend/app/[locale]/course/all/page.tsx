import React from 'react'
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from '@app/[locale]/components/BackButton';
 

const i18nNamespaces = ['common']

export default async function AllCoursesPage({params: {locale}}: { params: { locale: any} }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const headers = [t('name'), t('description'), t('open'), t('join/leave')]

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <BackButton 
                destination={'/home'}
                text={t('back_to') + ' ' + t('home') + ' ' +  t('page')}
            />
            <div style={{ marginBottom: '100px' }}>
            <ListView
                admin={true}
                headers={headers}
                get={'courses'}
                action_name={'join_course'}
                action_text={t('join_course')}
            />
            </div>
            <Footer/>
        </TranslationsProvider>
    )
}