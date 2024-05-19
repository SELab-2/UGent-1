import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from '@app/[locale]/components/BackButton';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';

const i18nNamespaces = ['common'];

export default async function Users({ params: { locale } }: { params: { locale: any } }) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [
        <React.Fragment key="email"><EmailIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('email')}</React.Fragment>,
        , 
        <React.Fragment key="role"><WorkIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('role')}</React.Fragment>
        , ''];
    const headers_backend = ['email', 'role', ''];

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <div style={{marginTop:60, padding:20}}>
            <BackButton 
                destination={'/home'} 
                text={t('back_to') + ' ' + t('home') + ' ' +  t('page')}
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
        </TranslationsProvider>
    );
}
