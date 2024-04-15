"use client"
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useTranslation} from "react-i18next";

//TODO: route to add project page
function AddButton({translationkey} : {translationkey: string}){
    const { t } = useTranslation()

    return(
        <Button
            variant="contained"
            color='secondary'
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
