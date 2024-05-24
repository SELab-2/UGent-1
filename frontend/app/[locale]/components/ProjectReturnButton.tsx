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
