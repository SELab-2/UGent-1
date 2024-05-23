'use client';

import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    Typography,
    tableCellClasses,
    TableSortLabel,
    TablePagination
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useTranslation} from "react-i18next";
import { styled } from '@mui/material/styles';
import {Project, getProjectsFromCourse, APIError, UserData, getUserData} from "@lib/api";
import baseTheme from "../../../styles/theme";

interface ProjectTableTeacherProps {
    course_id: number;
}

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: baseTheme.palette.primary.main,
        color: baseTheme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        backgroundColor: baseTheme.palette.secondary.main,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Data {
    id: string;
    name: string;
    deadline: string;
    visibility: boolean;
}

const convertDate = (date_str: string) => {
    let date = new Date(date_str);
    date = new Date(date.getTime());
    let date_local = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    date_local = date_local.replace(" at", "").replace(",", "");
    return date_local;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Project Name'},
    {id: 'deadline', numeric: false, disablePadding: false, label: 'Deadline'},
    {id: 'visibility', numeric: false, disablePadding: false, label: 'Visibility'},
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell/>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function ProjectTable({course_id}: ProjectTableTeacherProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [user, setUser] = useState<UserData | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const {t} = useTranslation();

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(projects, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, projects],
    );

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjects(await getProjectsFromCourse(course_id));
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }

        };

        fetchProjects();
    }, [course_id]);

    const handleRowClick = (row: any) => {
        setSelectedRow((prevSelectedRow) => (prevSelectedRow === row ? null : row));
        setSelectedId((prevSelectedId) => (prevSelectedId === row.project_id ? null : row.project_id));
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: "calc(100% - 40px)",

                }}
            >
                <Button
                    variant="contained"
                    color='secondary'
                    disabled={selectedId === null}
                    href={'/project/' + selectedId}
                    sx={{
                        width: 'fit-content',
                        color: 'secondary.contrastText',
                        marginBottom: 1
                    }}
                >
                    {t("details")}
                </Button>
            </Box>
            {projects.length === 0 ? (
                <Typography
                    variant="h5"
                    sx={{
                        color: 'text.disabled',
                        marginTop: 2
                    }}
                >
                    {t('no_projects')}
                </Typography>
            ) : (
                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{width: "100%"}}>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={projects.length}
                            />
                            <TableBody>
                                {visibleRows.map((row) => (
                                    <StyledTableRow key={row.project_id} onClick={() => handleRowClick(row)}
                                                    selected={selectedRow === row}>
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox checked={selectedRow === row} sx={{color:"black"}}/>
                                        </StyledTableCell>
                                        <StyledTableCell>{row.name}</StyledTableCell>
                                        <StyledTableCell>{convertDate(row.deadline)}</StyledTableCell>
                                        <StyledTableCell>
                                            {row.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={projects.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </>
    );
}

export default ProjectTable;