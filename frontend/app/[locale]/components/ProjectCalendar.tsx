'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { Box, Typography, Paper, List, ListItem, Divider, Badge, Skeleton } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjects } from '../calendar/useProjects';
import { useTranslation } from 'react-i18next';

// Fake fetch function that simulates fetching deadlines from the server
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
    /*
    * This component is the project calendar that is displayed in the calendar page.
    * It displays a calendar with highlighted days that have projects due on that day.
    * It also displays the projects due on the selected day.
    */
    const requestAbortController = useRef<AbortController | null>(null);
    const [value, setValue] = useState<Date | null>(new Date());
    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
    const [loadingCalendar, setLoadingCalendar] = useState<boolean>(true);
    const { projects, loading, error } = useProjects();
    const { t } = useTranslation();

    // Fetch highlighted days from the server
    const fetchHighlightedDays = (date: Date) => {
        const controller = new AbortController();
        fakeFetch(
            date,
            { signal: controller.signal },
            projects.map((project) => new Date(project.deadline))
        )
            .then(({ deadlinesToDisplay }) => {
                const uniqueDays = new Set(
                    deadlinesToDisplay.map((deadline) => deadline.getDate())
                );
                setHighlightedDays(Array.from(uniqueDays));
            })
            .catch((error: Error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            });

        requestAbortController.current = controller;
    };

    // Fetch highlighted days when the component mounts
    useEffect(() => {
        try {
            fetchHighlightedDays(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCalendar(false);
        }
        return () => requestAbortController.current?.abort();
    }, [projects]);

    // Loading state
    if (loading || loadingCalendar) {
        return(
            <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
            >
                <Skeleton
                    variant="rectangular"
                    width={300} height={300}
                    sx={{
                        borderRadius: 1,
                        marginTop: 2
                    }}
                />
                <Skeleton
                    variant="rectangular"
                    width={400} height={100}
                    sx={{
                        borderRadius: 1,
                        marginTop: 4
                    }}
                />
            </Box>
        );
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

    // Handle month and year change(refetch highlighted days when month or year changes)
    const handleMonthChange = (date: Date) => {
        if (requestAbortController.current) {
            requestAbortController.current.abort();
        }

        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

    const handleYearChange = (date: Date) => {
        if (requestAbortController.current) {
            requestAbortController.current.abort();
        }

        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

    // Render projects on the selected day
    const renderProjects = (date: Date) => {
        const projectsOnThisDay = projects.filter((project) =>
            isSameDay(new Date(project.deadline), date)
        );
        return projectsOnThisDay.length > 0 ? (
            <List>
                {projectsOnThisDay.map((project, index) => (
                    <div key={project.id}>
                        <ListItem onClick={() => window.location.href = `/project/${project.id}`}>
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

    // Custom day component that displays a badge with a schedule icon if the day has a project due
    function customDay(props: PickersDayProps<Date> & { highlightedDays?: number[] }) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

        const isHighlighted = !outsideCurrentMonth && highlightedDays.includes(day.getDate());

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                badgeContent={
                    isHighlighted ? (
                        <ScheduleIcon color={'primary'} fontSize={'small'} />
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
