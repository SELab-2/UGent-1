import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import EmailIcon from '@mui/icons-material/Email';

const i18nNamespaces = ['common']

export default async function StudentsPage({ params }: { params: { locale: any, course_id: number } }) {
    const { locale, course_id } = params;
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [
        <React.Fragment key="email"><EmailIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('email')}</React.Fragment>];
    const headers_backend = ['email'];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <Box width={'100%'} style={{padding:20}}>
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
                    get={'course_students'}
                    action_name={'remove_from_course'}
                    action_text={t('remove_user_from_course')}
                    search_text={t('search_student')}
                />
            </Box>
        </TranslationsProvider>
    );
}
