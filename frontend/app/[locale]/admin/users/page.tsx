import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from '@app/[locale]/components/BackButton';

const i18nNamespaces = ['common'];

export default async function Users({ params: { locale } }: { params: { locale: any } }) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('email'), t('role')];
    const headers_backend = ['email', 'role'];

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <div style={{marginTop:60, padding:20}}>
            <BackButton 
                destination={'/admin'} 
                text={t('back_to') + ' ' + t('admin') + ' ' +  t('page')}
            />
            <ListView
                admin={true}
                headers={headers}
                headers_backend={headers_backend}
                sortable={[true, false]}
                get={'users'}
                action_name={'remove'}
                action_text={t('remove_user')}
                search_text={t('search')}
            />
            </div>
            <Footer />
            <BackButton 
                destination={'/admin'} 
                text={t('back_to') + ' ' + t('admin') + ' ' +  t('page')}
            />
        </TranslationsProvider>
    );
}
