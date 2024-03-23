import { useState, useEffect } from 'react';
import initTranslations from "../app/i18n";

// This is a custom hook for client-side initialization
export const useClientSideTranslations = (locale: string, namespaces: string[]) => {
    const [t, setT] = useState<(key: string) => string>(() => key => key); // Dummy function to start with

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
