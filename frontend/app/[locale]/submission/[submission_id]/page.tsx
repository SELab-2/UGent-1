import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import SubmissionDetailsPage from "@app/[locale]/components/SubmissionDetailsPage";

const i18nNamespaces = ['common']

const SubmissionPage = async ({params: {locale, submission_id}}: {
    params: { locale: any, submission_id: number }
}) => {
    const {t, resources} = await initTranslations(locale, i18nNamespaces);

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <SubmissionDetailsPage
                submission_id={submission_id}
            />
        </TranslationsProvider>
    )
}

export default SubmissionPage;
