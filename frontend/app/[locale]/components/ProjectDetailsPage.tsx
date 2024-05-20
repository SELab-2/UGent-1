'use client'
import React, { useEffect, useState } from "react";
import {checkGroup, getGroup, getProject, getUserData, Project, UserData} from "@lib/api";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid, IconButton, LinearProgress, ThemeProvider, Skeleton } from "@mui/material";
import ProjectSubmissionsList from "@app/[locale]/components/ProjectSubmissionsList";
import GroupSubmissionList from "@app/[locale]/components/GroupSubmissionList";
import baseTheme from "@styles/theme";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const backend_url = process.env["NEXT_PUBLIC_BACKEND_URL"];

interface ProjectDetailsPageProps {
  locale: any;
  project_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  locale,
  project_id,
}) => {
  const { t } = useTranslation();

  const [project, setProject] = useState<Project>();
  const [loadingProject, setLoadingProject] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isInGroup, setIsInGroup] = useState(false);
  const previewLength = 300;
  const deadlineColorType = project?.deadline
    ? checkDeadline(project.deadline)
    : "textSecondary";
  const deadlineColor =
    baseTheme.palette[deadlineColorType]?.main ||
    baseTheme.palette.text.secondary;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(await getUserData());
      } catch (error) {
        console.error("There was an error fetching the user data:", error);
      }
    };

    fetchUser().then(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setProject(await getProject(project_id));
      } catch (error) {
        console.error("There was an error fetching the project:", error);
      }
    };

    fetchProject().then(() => setLoadingProject(false));
    checkGroup(project_id).then((response) => setIsInGroup(response));
  }, [project_id]);

  useEffect(() => {
    if (!loadingUser && !loadingProject && user) {
      if (!user.course.includes(Number(project?.course_id))) {
        window.location.href = `/403/`;
      } else {
        console.log("User is in course");
      }
    }
  }, [loadingUser, user, loadingProject, project]);

  if (loadingProject) {
    return <LinearProgress />;
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  function formatDate(isoString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const date = new Date(isoString);
    return date.toLocaleString(locale, options);
  }

  function checkDeadline(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return now < deadlineDate ? "success" : "failure";
  }

  return (
    <ThemeProvider theme={baseTheme}>
      <Box style={{ padding: "16px", maxWidth: "100%" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              href={`/${locale}/course/${project?.course_id}`}
            >
              {t("return_course")}
            </Button>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              width={'100%'}
              marginY={2}
            >
              <Typography
                  variant="h4"
                  display={'inline-block'}
                  whiteSpace={'nowrap'}
                  marginRight={2}
              >
                {project?.name}
              </Typography>
              <Box
                width={'fit-content'}
              >
                {loadingUser ? (
                    [1, 2].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rectangular"
                            width={150}
                            height={45}
                            sx={{
                              borderRadius: "8px",
                              marginX: 1,
                            }}
                        />
                    ))) : (
                  <>
                    {user?.role !== 3 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<EditIcon />}
                            href={`/${locale}/project/${project_id}/edit`}
                            sx={{
                              fontSize: "0.75rem",
                              py: 1,
                              marginRight: 1,
                              marginY: 1,
                            }}
                        >
                          {t("edit_project")}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<GroupIcon />}
                        href={`/${locale}/project/${project_id}/groups`}
                        sx={{ fontSize: "0.75rem", py: 1 }}
                    >
                      {t("groups")}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Divider style={{ marginBottom: "1rem" }} />
            <Typography variant="h5">{t("assignment")}</Typography>
            <Typography>
              {project?.description &&
              project?.description.length > previewLength &&
              !isExpanded
                ? `${project?.description.substring(0, previewLength)}...`
                : project?.description}
            </Typography>
            {project?.description && project?.description.length > previewLength && (
              <IconButton color="primary" onClick={toggleDescription}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            <Typography variant="h6">{t("required_files")}</Typography>
            <Typography variant={"body1"}>
                <pre>
                    {generateDirectoryTree(project?.file_structure).split('\n').map((line: string, index: number) => (
                            <React.Fragment key={index}>
                                {line}
                                <br/>
                            </React.Fragment>
                    ))}
                </pre>
            </Typography>
            <Typography variant="h6">{t("conditions")}</Typography>
            <Typography>{project?.conditions}</Typography>
            <Typography>
              <b>{t("max_score")}: </b>
              {project?.max_score}
            </Typography>
            <Typography>
              <b>{t("number_of_groups")}: </b>
              {project?.number_of_groups}
            </Typography>
            <Typography>
              <b>{t("group_size")}: </b>
              {project?.group_size}
            </Typography>
            {user?.role !== 3 && (
              <Button
                variant="contained"
                color="secondary"
                href={`${backend_url}/projects/${project_id}/download_testfiles`}
                startIcon={<DownloadIcon />}
                sx={{ my: 1 }}
              >
                {t("test_files")}
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">{t("submissions")}</Typography>
            <div style={{ display: "flex", alignItems: "center", my: 1 }}>
              <AccessTimeIcon style ={{ marginRight: 4, color: deadlineColor }} />
              <Typography variant="body1" style={{ color: deadlineColor }}>
                {project?.deadline ? formatDate(project.deadline) : "No Deadline"}
              </Typography>
            </div>
            {user?.role === 3 ? (
              isInGroup ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    href={`/${locale}/project/${project_id}/submit`}
                    sx={{ my: 1 }}
                  >
                    {t("add_submission")}
                  </Button>
              ) : (
                    <Typography variant="body1" style={{ color: "red", marginTop: "5px" }}>
                        {t("not_in_group")}
                    </Typography>
              )
            ) : null}
          </Grid>
          <Grid item xs={12}>
            {user?.role === 3 ? (
              <GroupSubmissionList
                project_id={project_id}
                page_size={8}
                search={t("submission_search")}
              />
            ) : (
              <ProjectSubmissionsList
                project_id={project_id}
                page_size={8}
                search={t("submission_search")}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

function buildTree(paths) {
    const tree = {};
    const paths_list = paths.split(',');
    paths_list.forEach(path => {
        const parts = path.split('/');
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                if (index === parts.length - 1) {
                    current[part] = {};
                } else {
                    current[part] = current[part] || {};
                }
            }
            current = current[part];
        });
    });

    return tree;
}

function buildTreeString(tree, indent = '') {
    let treeString = '';

    const keys = Object.keys(tree);
    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        treeString += `${indent}${isLast ? '└── ' : '├── '}${key}\n`;
        treeString += buildTreeString(tree[key], indent + (isLast ? '    ' : '│   '));
    });

    return treeString;
}

function generateDirectoryTree(filePaths) {
    const tree = buildTree(filePaths);
    return `.\n${buildTreeString(tree)}`;
}

export default ProjectDetailsPage;
