"use client"
import NavBar from "@app/[locale]/components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import DeleteButton from "@app/[locale]/components/user_components/DeleteButton";
import EditUserForm from "@app/[locale]/components/EditUserForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import React, {useEffect, useState} from "react";
import {getUserData, UserData} from "@lib/api";
import {CircularProgress} from "@mui/material";

function UserEditPage({params: {locale, id}}: { params: { locale: any, id: number } }) {
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

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                user?.role !== 1 ? (
                    window.location.href = `/403/`
                ) : (
                    <Box
                        padding={5}
                        sx={{
                            display: 'flex',
                            alignItems: 'space-between',
                            justifyContent: 'space-between',
                        }}
                    >
                        <EditUserForm userId={id}/>
                        <DeleteButton userId={id}/>
                    </Box>
            ))}
            <div id="extramargin" style={{height: "100px"}}></div>
        </TranslationsProvider>
    );
}

export default UserEditPage;
