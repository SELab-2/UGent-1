import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';

const i18nNamespaces = ['common']

export default async function StudentsPage({ params }: { params: { locale: any, courseId: number } }) {
    const { locale, courseId } = params;
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('name'), t('email'), t('role')];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <div style={{ marginBottom: '100px' }}>
                <ListView
                    admin={true}
                    headers={headers}
                    get_id={courseId}
                    get={'course_users'}
                    action_name={'remove_from_course'}
                    tablenames={[t('students'), t('teachers')]}
                />
            </div>
            <Footer />
        </TranslationsProvider>
    );
}
