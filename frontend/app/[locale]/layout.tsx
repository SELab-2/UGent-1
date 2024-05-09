import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import baseTheme from '@styles/theme';
import React from "react";

import '../i18n'
import Footer from "@app/[locale]/components/Footer";

export default function RootLayout(props: React.PropsWithChildren<{}>) {
    const {children} = props;
    return (
        <html lang="en">
        <body style={{margin: 0}}>
        <AppRouterCacheProvider>
            <ThemeProvider theme={baseTheme}>
                <div style={{marginTop: "64px", height: "fit-content", minHeight: '100vh'}}>
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
