import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import BackButton from "@app/[locale]/components/BackButton";

const i18nNamespaces = ['common']

export default async function TeachersPage({ params }: { params: { locale: any, course_id: number } }) {
    const { locale, course_id } = params;
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('email')];
    const headers_backend = ['email'];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <div style={{marginTop: 60, padding: 20}}>
                <BackButton
                    destination={`/course/${course_id}`}
                    text={t('back_to') + ' ' + t('course')}
                />
                <div style={{marginBottom: '100px'}}>
                    <ListView
                        admin={true}
                        headers={headers}
                        sortable={[true]}
                        get_id={course_id}
                        get={'course_teachers'}
                        search_text={t('search')}
                    />
                </div>
            </div>
        </TranslationsProvider>
);
}
