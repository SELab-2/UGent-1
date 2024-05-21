'use client';

import React, { useState } from 'react';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { CircularProgress, Box, Typography, Paper, List, ListItem, Divider, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjects } from '../calendar/useProjects';
import { styled } from '@mui/system';

interface CustomPickersDayProps extends PickersDayProps<Date> {
  isProjectDay?: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isProjectDay',
})<CustomPickersDayProps>(({ theme, isProjectDay }) => ({
  ...(isProjectDay && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.info.main,
    },
  }),
})) as React.ComponentType<CustomPickersDayProps>;

const ProjectCalendar: React.FC = () => {
  const [value, setValue] = useState<Date | null>(new Date());
  const { projects, loading, error } = useProjects();

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

  const handleProjectClick = (projectId: string) => {
    window.location.href = `/project/${projectId}`;
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setValue(date);
      const projectsOnThisDay = projects.filter(project =>
        isSameDay(new Date(project.deadline), date)
      );
      if (projectsOnThisDay.length === 1) {
        window.location.href = `/project/${projectsOnThisDay[0].id}`;
      }
      // You may handle the case of multiple projects differently, such as showing a modal or a list of projects.
    }
  };

  const renderProjects = (date: Date) => {
    const projectsOnThisDay = projects.filter(project =>
      isSameDay(new Date(project.deadline), date)
    );
    return projectsOnThisDay.length > 0 ? (
      <List>
        {projectsOnThisDay.map((project, index) => (
          <div key={project.id}>
            <ListItem button onClick={() => handleProjectClick(project.id)}>
              {project.name}
            </ListItem>
            {index !== projectsOnThisDay.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    ) : (
      <Typography>No projects on this day</Typography>
    );
  };
const renderDay = (day: Date, _selectedDate: Date | null, pickersDayProps: any) => {
  const isProjectDay = projects.some(project => isSameDay(new Date(project.deadline), day));

  return (
    <PickersDay
      {...pickersDayProps}
      day={day}
      sx={{
        ...(isProjectDay && {
          backgroundColor: 'lightblue',
          borderRadius: '50%',
        }),
      }}
      onClick={() => handleDateChange(day)}
    />
  );
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={value}
          onChange={setValue}
          renderDay={renderDay}
        />
      </LocalizationProvider>
      <Paper sx={{ marginTop: 2, padding: 2, width: '100%' }}>
        {value && renderProjects(value)}
      </Paper>
    </Box>
  );
};

export default ProjectCalendar;
