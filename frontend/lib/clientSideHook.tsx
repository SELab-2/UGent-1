import {useEffect, useState} from 'react';
import initTranslations from "../app/i18n";

export const useClientSideTranslations = (locale: string, namespaces: string[]) => {
    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);

    useEffect(() => {
        let isMounted = true;

        initTranslations(locale, namespaces).then(translation => {
            if (isMounted) {
                setT(() => translation.t);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [locale, namespaces]);

    return t;
};
