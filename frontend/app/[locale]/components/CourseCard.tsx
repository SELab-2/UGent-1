import React from 'react';
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

const CourseCard = ({courseName, teacherName, projects}) => {
    return (
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
                            {projects.map((project, index) => (
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
    );
};

export default CourseCard;
