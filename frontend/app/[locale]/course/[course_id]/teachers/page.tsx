import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

const i18nNamespaces = ['common']

export default async function TeachersPage({params}: { params: { locale: any, course_id: number } }) {
    const {locale, course_id} = params;
    const {t, resources} = await initTranslations(locale, i18nNamespaces);

    const headers = [t('email')];
    const headers_backend = ['email'];

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <div style={{marginTop: 20, padding: 20}}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon/>}
                    href={`/course/${course_id}`}
                >
                    {t('back_to') + ' ' + t('course') + ' ' + t('page')}
                </Button>
                <ListView
                    admin={true}
                    headers={headers}
                    headers_backend={headers_backend}
                    sortable={[true]}
                    get_id={course_id}
                    get={'course_teachers'}
                    search_text={t('search_teacher')}
                />
            </div>
        </TranslationsProvider>
    );
}
