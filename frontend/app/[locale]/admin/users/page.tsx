"use client";
import React, {useEffect, useState} from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import {fetchUserData, UserData} from "@lib/api";
import UserList from "@app/[locale]/components/admin_components/UserList";
import {Box, CircularProgress} from "@mui/material";

const i18nNamespaces = ['common'];

export default function Users({ params: { locale } }: { params: { locale: any } }) {
    const [resources, setResources] = useState();
    const [user, setUser] = useState<UserData | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                const result = await initTranslations(locale, ["common"]);
                setResources(result.resources);
                const userData = await fetchUserData();
                setUser(userData);
                if (userData.role !== 1) {
                    setAccessDenied(true);
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }
            } catch (error) {
                console.error("There was an error initializing the page:", error);
            } finally {
                setUserLoading(false);
                setIsLoading(false);
            }
        };

        initialize();
    }, [locale]);

    if (isLoading) {
        return (
            <Box padding={5} sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            {!accessDenied && <UserList />}
        </TranslationsProvider>
    );
}
