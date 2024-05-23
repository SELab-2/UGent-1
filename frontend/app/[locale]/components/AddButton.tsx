"use client"
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useTranslation} from "react-i18next";

function AddButton({translationkey, href} : {translationkey: string, href : string|undefined}){
    /*
    * General add button component
    * @param translationkey: The key of the translation in the i18n file
    * @param href: The href of the button
    * */
    const { t } = useTranslation()

    return(
        <Button
            variant="contained"
            color='secondary'
            href={href}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
                width: 'fit-content',
                color: 'secondary.contrastText',
            }}
        >
            {t(translationkey)}
        </Button>
    )
}

export default AddButton
