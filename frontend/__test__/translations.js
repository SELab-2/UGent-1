import initTranslations from "../app/i18n";

export default async function getTranslations() {
    let {t: t_en, resources: resources_en} = await initTranslations('en', ['common']);
    const translations_en = {
        t: t_en,
        resources: resources_en,
        locale: 'en',
        i18nNamespaces: ['common']
    };

    let {t: t_nl, resources: resources_nl} = await initTranslations('nl', ['common']);
    const translations_nl = {
        t: t_nl,
        resources: resources_nl,
        locale: 'nl',
        i18nNamespaces: ['common']
    }

    return {
        en: translations_en,
        nl: translations_nl
    };
}