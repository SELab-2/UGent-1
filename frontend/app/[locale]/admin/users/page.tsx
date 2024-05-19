"use client";
import React, {useEffect, useState} from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import ListView from '@app/[locale]/components/ListView';
import BackButton from '@app/[locale]/components/BackButton';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import {getUserData, UserData} from "@lib/api";
import UserList from "@app/[locale]/components/admin_components/UserList";
import {Box, CircularProgress} from "@mui/material";

const i18nNamespaces = ['common'];

export default function Users({ params: { locale } }: { params: { locale: any } }) {
    const [resources, setResources] = useState();
    const [user, setUser] = useState<UserData | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        initTranslations(locale, ["common"]).then((result) => {
            setResources(result.resources);
        })

        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        fetchUser().then(() => setUserLoading(false));
    }, [locale])

    console.log(user?.role);
    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                user?.role !== 1 ? (
                    window.location.href = `/403/`
                ) : (
                    <UserList />
            ))}
        </TranslationsProvider>
    );
}
