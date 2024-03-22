import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CourseCardTheme} from '../../../styles/theme';
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

type Project = {
    name: string;
    deadline: string;
    submissions: number;
};

type CourseCardProps = {
    courseName: string;
    teacherName: string;
    projects: Project[];
};

const CourseCard: React.FC<CourseCardProps> = ({courseName, teacherName, projects}) => {
    return (
        <ThemeProvider theme={CourseCardTheme}>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {courseName}
                    </Typography>
                    <Typography color="text.text" gutterBottom>
                        {teacherName}
                    </Typography>
                    <TableContainer>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project</TableCell>
                                    <TableCell align="right">Deadline</TableCell>
                                    <TableCell align="right">Submissions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project: Project, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            {project.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {project.deadline}
                                        </TableCell>
                                        <TableCell align="right">
                                            {project.submissions}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default CourseCard;
