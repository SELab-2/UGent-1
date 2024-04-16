import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from "@app/[locale]/components/BackButton";

const i18nNamespaces = ['common']

export default async function StudentsPage({ params }: { params: { locale: any, course_id: number } }) {
    const { locale, course_id } = params;
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('email')];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <BackButton 
                destination={`/course/${course_id}`}
                text={t('back_to') + ' ' + t('course_detail') + ' ' +  t('page')}
            />
            <div style={{ marginBottom: '100px' }}>
                <ListView
                    admin={true}
                    headers={headers}
                    get_id={course_id}
                    get={'course_students'}
                    action_name={'remove_from_course'}
                    tablenames={[t('students'), t('teachers')]}
                    action_text={t('remove_user_from_course')}
                    search_text={t('search')}
                />
            </div>
            <Footer />
        </TranslationsProvider>
    );
}
