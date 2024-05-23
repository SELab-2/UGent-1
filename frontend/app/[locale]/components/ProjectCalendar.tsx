'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { CircularProgress, Box, Typography, Paper, List, ListItem, Divider, Badge } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjects } from '../calendar/useProjects';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

interface CustomPickersDayProps extends PickersDayProps<Date> {
  isProjectDay?: boolean;
}

function fakeFetch(
    date: Date,
    { signal }: { signal: AbortSignal },
    deadlines: Date[]
) {
  return new Promise<{ deadlinesToDisplay: Date[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const deadlinesToDisplay = deadlines.filter(
          (deadline) =>
              deadline.getMonth() === date.getMonth() &&
              deadline.getFullYear() === date.getFullYear()
      );
      resolve({ deadlinesToDisplay });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const ProjectCalendar: React.FC = () => {
  const requestAbortController = useRef<AbortController | null>(null);
  const [value, setValue] = useState<Date | null>(new Date());
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();

  const fetchHighlightedDays = (date: Date) => {
    const controller = new AbortController();
    fakeFetch(
        date,
        { signal: controller.signal },
        projects.map((project) => new Date(project.deadline))
    )
        .then(({ deadlinesToDisplay }) => {
          setHighlightedDays(
              deadlinesToDisplay.map((deadline) => deadline.getDate())
          );
        })
        .catch((error: Error) => {
          if (error.name !== 'AbortError') {
            throw error;
          }
        });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(new Date());
    return () => requestAbortController.current?.abort();
  }, [projects]); // Dependency on projects to refetch when projects data changes

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
  };

  const handleProjectClick = (projectId: number) => {
    window.location.href = `/project/${projectId}`;
  };

  const handleMonthChange = (date: Date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleYearChange = (date: Date) => {
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setValue(date);
      const projectsOnThisDay = projects.filter((project) =>
          isSameDay(new Date(project.deadline), date)
      );
      if (projectsOnThisDay.length === 1) {
        window.location.href = `/project/${projectsOnThisDay[0].id}`;
      }
      // You may handle the case of multiple projects differently, such as showing a modal or a list of projects.
    }
  };

  const renderProjects = (date: Date) => {
    const projectsOnThisDay = projects.filter((project) =>
        isSameDay(new Date(project.deadline), date)
    );
    return projectsOnThisDay.length > 0 ? (
        <List>
          {projectsOnThisDay.map((project, index) => (
              <div key={project.id}>
                <ListItem button onClick={() => handleProjectClick(project.id)}>
                  <Typography>{project.name}</Typography>
                </ListItem>
                {index !== projectsOnThisDay.length - 1 && <Divider />}
              </div>
          ))}
        </List>
    ) : (
        <Typography marginTop={2} color={'text.disabled'}>
          {t('no_projects_on_selected_date')}
        </Typography>
    );
  };

  function customDay(props: PickersDayProps<Date> & { highlightedDays?: number[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isHighlighted = highlightedDays.includes(day.getDate());

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={
              isHighlighted ? (
                  <AssignmentIcon color={'primary'} fontSize={'small'} />
              ) : undefined
            }
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
  }

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
              value={value}
              onChange={(date) => {
                setValue(date);
                fetchHighlightedDays(date || new Date());
              }}
              onMonthChange={(newValue) => handleMonthChange(newValue)}
              onYearChange={(newValue) => handleYearChange(newValue)}
              slots={{
                day: customDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                } as never,
              }}
          />
        </LocalizationProvider>
        <Paper sx={{ marginTop: 2, padding: 2, width: '100%' }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            {t('projects_on_selected_date')}
          </Typography>
          <Divider />
          {value && renderProjects(value)}
        </Paper>
      </Box>
  );
};

export default ProjectCalendar;
