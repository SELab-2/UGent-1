import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';

const i18nNamespaces = ['common']

export default async function GroupPage({ params }: { params: { locale: any, project_id: number } }) {
    const { locale, project_id: projectId } = params; 
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('group_nr')];
    
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
                    get_id={projectId}
                    get={'groups'}
                />
            </div>
            <Footer />
        </TranslationsProvider>
    );
}
