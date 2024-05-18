"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Course, getLastSubmissionFromProject, getProjectsFromCourse, Project, Submission } from '@lib/api';
import { useTranslation } from 'react-i18next';
import ListView from '@app/[locale]/components/ListView';
import AccesAlarm from '@mui/icons-material/AccessAlarm';
import Person from '@mui/icons-material/Person';

const CourseCard = ({ params: { course } }: { params: { course: Course } }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjectsFromCourse(course.course_id);
        setProjects(fetchedProjects);
        
        // Fetch last submission for each project
        const promises = fetchedProjects.map(async (project) => {
          const lastSubmission = await getLastSubmissionFromProject(project.project_id);
          return { projectId: project.project_id, lastSubmission };
        });
        const projectSubmissions = await Promise.all(promises);
        setLastSubmission(projectSubmissions);
      } catch (error) {
        console.error(error);
      }
    };
        fetchProjects();
    }, [course.course_id]);

    const headers = [
    <React.Fragment key="name"><Person style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('name')}</React.Fragment>, 
    <React.Fragment key="deadline"><AccesAlarm style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " +t('deadline')}</React.Fragment>, 
    ''
];
    const headers_backend = ['name', 'deadline', '']

  return (
    <Card sx={{ width: '100%', margin: '16px', borderRadius: '8px' }}>
      <CardMedia sx={{ height: 150, backgroundColor: 'secondary.main' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          onClick={() => window.location.href = `/course/${course.course_id}`}
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h5" component="div">
            {course.name}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent>
        <Typography variant="h6" component="div" marginBottom={2}>
          {t('projects')}
        </Typography>
        {projects.length === 0 ? (
          <Typography variant="h4" color="text.disabled" align="center">
            {t('no_projects')}
          </Typography>
        ) : (
          <ListView
            admin={false}
            headers={headers}
            headers_backend={headers_backend}
            sortable={[true, true, false]}
            get="projects"
            get_id={course.course_id}
            search={false}
            pageSize={3}
            lastSubmissions={lastSubmission}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
