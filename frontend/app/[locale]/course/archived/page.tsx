import React from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import BackButton from "@app/[locale]/components/BackButton";
import NotesIcon from '@mui/icons-material/Notes';
import Typography from "@mui/material/Typography";

const i18nNamespaces = ['common'];

const ArchivePage = async ({params: {locale}}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces);
    const headers = [t('name'), 
    <React.Fragment key="description"><NotesIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('description')}</React.Fragment>,
    , t('open')];
    const headers_backend = ['name', 'description', 'open'];

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <div
                style={{
                    padding: 20,
                    width: '100%'
            }}
            >
                <BackButton
                    destination={'/home'}
                    text={t('back_to') + ' ' + t('home') + ' ' + t('page')}
                />
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2,
                        marginBottom: 2
                    }}
                >
                    {t('courses_archive')}
                </Typography>
                <ListView
                    admin={true}
                    headers={headers}
                    headers_backend={headers_backend}
                    sortable={[true, false, false]}
                    get={'archived_courses'}
                />
            </div>
        </TranslationsProvider>
    );
};

export default ArchivePage;
