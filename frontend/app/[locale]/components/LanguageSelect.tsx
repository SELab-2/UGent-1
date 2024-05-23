"use client"

import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../../i18nConfig';

const LanguageSelect = () => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const router = useRouter();
    let currentPathname = usePathname();

    const handleChange = (e: SelectChangeEvent<String>) => {
        const newLocale = e.target.value;

        // set cookie for next-i18n-router
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        // redirect to the new locale path
        if (
            currentLocale === i18nConfig.defaultLocale &&
            !i18nConfig.prefixDefault
        ) {
            router.push('/' + newLocale + currentPathname);
        } else {
            if (currentPathname == null) {
                currentPathname = '/'
            }
            router.push(
                currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
            );
        }

        router.refresh();
    };

    return (
        <div>
            <Select
                autoWidth
                value={currentLocale}
                defaultValue={"nl"}
                onChange={handleChange}
                sx={{
                    color: "white",
                    boxShadow: "none",
                    ".MuiOutlinedInput-notchedOutline": {
                        border: 0
                    },
                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        border: 0,
                    },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: 0,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'secondary.main',
                    },
                    '.MuiSvgIcon-root ': {
                        fill: "white !important",
                    },
                    '&:hover': {
                        color: 'secondary.main',
                        backgroundColor: 0,
                    },
                    "&:hover .MuiSelect-icon": {
                        color: "secondary.main"
                    }
                }}
            >
                <MenuItem value='en'>
                    English
                </MenuItem>
                <MenuItem value='nl'>
                    Nederlands
                </MenuItem>
            </Select>
        </div>
    );
}

export default LanguageSelect;
