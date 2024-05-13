import NavBar from "@app/[locale]/components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import DeleteButton from "@app/[locale]/components/user_components/DeleteButton";
import EditUserForm from "@app/[locale]/components/EditUserForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

async function UserEditPage({params: {locale, id}}: { params: { locale: any, course_id: number } }) {
    const {t, resources} = await initTranslations(locale, ["common"])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
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
            <div id="extramargin" style={{height: "100px"}}></div>
        </TranslationsProvider>
    );
}

export default UserEditPage;
