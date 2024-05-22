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
    const [accessDenied, setAccessDenied] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initTranslations(locale, ["common"]).then((result) => {
            setResources(result.resources);
        });

        const fetchUser = async () => {
            try {
                const userData = await fetchUserData();
                setUser(userData);
                if (userData.role !== 1) {
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            } finally {
                setUserLoading(false);
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [locale]);

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            {isLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                !accessDenied && <UserList />
            )}
        </TranslationsProvider>
    );
}
