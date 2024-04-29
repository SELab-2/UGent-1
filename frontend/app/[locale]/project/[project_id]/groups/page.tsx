import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from "@app/[locale]/components/BackButton";

const i18nNamespaces = ['common']

export default async function GroupPage({ params }: { params: { locale: any, project_id: number } }) {
    const { locale, project_id: projectId } = params; 
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    const headers = [t('group_nr'), t('members'), t('join/leave')];
    const headers_backend = ['group_nr', 'members', 'join/leave'];
    
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <div style={{marginTop:60, padding:20}}>
            <BackButton 
            destination={`/project/${projectId}`} 
            text={t('back_to') + ' ' + t('project') + ' ' +  t('page')}
            />
                <ListView
                    admin={true}
                    headers={headers}
                    headers_backend={headers_backend}
                    sortable={[true, false, false]}
                    get_id={projectId}
                    get={'groups'}
                />
            </div>
        </TranslationsProvider>
    );
}
