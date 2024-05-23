import React from "react";
import {useTranslation} from "react-i18next";
import {Button, ThemeProvider} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {baseTheme} from "@styles/theme";

interface ProjectReturnButtonProps {
    locale: any;
    project_id: number | undefined;
}

const ProjectReturnButton: React.FC<ProjectReturnButtonProps> = ({locale, project_id}) => {
    /*
    * This component is the return button that is displayed on the project page.
    * @param locale: The current locale of the page
    * @param project_id: The id of the project
    */
    const {t} = useTranslation();

    return (
        <ThemeProvider theme={baseTheme}>
            <Button
                component="a"
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon/>}
                href={`/${locale}/project/${project_id}`}
            >
                {t("return_project")}
            </Button>
        </ThemeProvider>
    );
};

export default ProjectReturnButton;
