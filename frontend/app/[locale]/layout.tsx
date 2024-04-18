import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import loginTheme from '../../styles/theme';
import React from "react";

import '../i18n'
import Footer from "@app/[locale]/components/Footer";

export const metadata = {
    title: 'Pigeonhole',
    description: 'Groep 1'
}

export default function RootLayout(props: React.PropsWithChildren<{}>) {
    const {children} = props;
    return (
        <html lang="en">
        <body style={{margin: 0}}>
        <AppRouterCacheProvider>
            <ThemeProvider theme={loginTheme}>
                <div style={{marginTop: "40px", height: "100vh"}}>
                    {children}
                </div>
                <div id='extrapadding' style={{height: "20px"}}></div>
                <Footer/>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
