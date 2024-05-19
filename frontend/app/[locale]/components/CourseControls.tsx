import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArchiveIcon from '@mui/icons-material/Archive';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { APIError, getUserData, UserData } from '@lib/api';

const CourseControls = ({ selectedYear, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;

  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<APIError | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(await getUserData());
      } catch (error) {
        if (error instanceof APIError) setError(error);
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const years = [
    `${currentYear - 2}-${(currentYear - 1).toString().slice(-2)}`,
    academicYear,
    `${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
  ];

  return (
    <Box sx={{ py: 1, px: 2 }}>
      <Typography variant="h3" gutterBottom>
        {t('courses')}
      </Typography>
      <Stack direction="column" spacing={2}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Button variant="contained" color="secondary" startIcon={<FilterListIcon />} sx={{ width: 'fit-content' }}>
              {t('filter_courses')}
            </Button>
          </Grid>
          {user?.role !== 3 && (
            <Grid item>
              <Link href="/course/add" passHref>
                <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />}>
                  {t('create_course')}
                </Button>
              </Link>
            </Grid>
          )}
          <Grid item>
            <Link href="/course/all" passHref>
              <Button variant="contained" color="secondary" startIcon={<ViewListIcon />}>
                {t('all_courses')}
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/course/archived" passHref>
              <Button variant="contained" color="secondary" startIcon={<ArchiveIcon />}>
                {t('view_archive')}
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/admin/users" passHref>
              <Button variant="contained" color="secondary" startIcon={<SupervisorAccountIcon />}>
                {t('site_users')}
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Select
          value={selectedYear}
          onChange={onYearChange}
          displayEmpty
          color="secondary"
          variant="outlined"
          IconComponent={KeyboardArrowDownIcon}
          sx={{ '.MuiSelect-select': { pl: 1 } }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Box>
  );
};

export default CourseControls;
