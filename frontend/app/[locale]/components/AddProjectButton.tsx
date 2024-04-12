"use client"
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useTranslation} from "react-i18next";

//TODO: route to add project page
const AddProjectButton = () => {
    const { t } = useTranslation()

    return(
        <Button
            variant="contained"
            color='secondary'
            href={'/project/add'}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
                width: 'fit-content',
                color: 'secondary.contrastText',
            }}
        >
            {t("add_project")}
        </Button>
    )
}

export default AddProjectButton
