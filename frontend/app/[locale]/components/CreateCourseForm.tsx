"use client"
import {postForm} from "@lib/api";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const CreateCourseForm = () => {
    const { t } = useTranslation()

    return(
        <form onSubmit={postForm("/courses/")}>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="name">{t("name")}:</label><br/>
                <input type="text" id="name" name="name" required/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="description">{t("description")}:</label><br/>
                <textarea id="description" name="description" rows={4} required/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <button type="submit">{t("save")}</button>
            </Box>
        </form>
    )
}

export default CreateCourseForm