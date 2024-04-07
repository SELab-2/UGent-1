"use client"
import React, {useEffect, useState} from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import loginTheme from '../../styles/theme';
import { isLoggedIn } from '@lib/api';



export default function RootLayout(props: React.PropsWithChildren<{}>) {
    const {children} = props;

    useEffect(() => {
        const loggedInCheck = async () => {
            if (!(await isLoggedIn()) && window.location.pathname !== '/') {
                if(window.location.pathname !== '/'){
                    const redirect = window.location.href
                    window.location.href = `/?redirect=${redirect}`;
                }else{
                    window.location.href = `/`;
                }
            }
        }
        // loggedInCheck();
    }, []);

    return (
        <html lang="en">
        <body>
        <AppRouterCacheProvider>
            <ThemeProvider theme={loginTheme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
