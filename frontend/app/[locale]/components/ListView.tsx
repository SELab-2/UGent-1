'use client'
import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    Typography,
    IconButton,
    TextField,
    tableCellClasses,
    TableSortLabel,
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import {styled} from '@mui/system';
import {NextPage} from 'next';
import checkMarkImage from './check-mark.png';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from "@mui/icons-material/Cancel";
import {
    deleteData, getArchivedCourses,
    getCourses,
    getGroups_by_project,
    getGroupSubmissions,
    getProject,
    getProjects_by_course,
    getProjectSubmissions,
    getStudents_by_course,
    getTeachers_by_course,
    getUser,
    getUserData,
    getUsers,
    postData,
    getOpenCourses
} from '@lib/api';
import baseTheme from "../../../styles/theme";
import {useTranslation} from "react-i18next";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

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

const RemoveButton = styled(Button)({
    marginBottom: '16px',
    alignSelf: 'flex-end',
    fontSize: '0.8rem',
    minWidth: 'auto',
    width: 'auto',
});

interface ListViewProps {
    admin: boolean;
    get: string;
    get_id: number;
    headers: string[];
    tablenames: string[];
    action_name: string;
    action_text: string;
    search_text: string;
    sortable: boolean[];
    page_size: number;
    headers_backend: string[];
    search: boolean;
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

const ListView: NextPage<ListViewProps> = ({
                                               admin,
                                               get,
                                               get_id,
                                               headers,
                                               headers_backend,
                                               sortable,
                                               action_name,
                                               action_text,
                                               search_text,
                                               page_size = 5,
                                               search = true
                                           }: ListViewProps) => {
    // default listview
    const [searchTerm, setSearchTerm] = useState('');
    const [rows, setRows] = useState<(string | number | boolean)[][]>([]);
    const [sortConfig, setSortConfig] = useState({key: headers_backend[0], direction: 'asc'});
    // group screen
    const [user, setUser] = useState<any>();
    const [user_is_in_group, setUserIsInGroup] = useState(false);
    const [project, setProject] = useState<any>();
    // multiple pages
    const [currentPage, setCurrentPage] = useState(1);
    const [previousPage, setPreviousPage] = useState(0);
    const [nextPage, setNextPage] = useState(0);
    const {t} = useTranslation();

    // ids of selected row items
    const [selected, setSelected] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                /**
                 *
                 *  EDIT
                 *
                 */

                const parse_pages = (response: any) => {
                    if (response.previous) {
                        setPreviousPage(1);
                    } else {
                        setPreviousPage(0);
                    }
                    if (response.next) {
                        setNextPage(1);
                    } else {
                        setNextPage(0);
                    }
                    return response.results;
                }

                const hashmap_get_to_parser: { [key: string]: (data: any) => any[] | Promise<any[]> } = {
                    'users': (data) => [data.id, data.email, data.role],
                    'course_students': (data) => [data.id, data.email],
                    'course_teachers': (data) => [data.id, data.email],
                    'courses': (data) => [data.course_id, data.name, data.description, data.open_course],
                    'projects': (data) => [data.project_id, data.name, convertDate(data.deadline)],
                    'groups': async (data) => {
                        let l = [];
                        // Iterate over the values of the object
                        for (const user_id of Object.values(data.user)) {
                            const i = await getUser(Number(user_id));
                            if (i.id === user.id) {
                                setUserIsInGroup(true);
                            }
                            l.push(i.email);
                        }
                        return [data.group_id, data.user, data.group_nr, l.join(', ')];
                    },
                    'submissions': (data) => [data.submission_id, data.group_id, convertDate(data.timestamp), data.output_test !== undefined],
                    'submissions_group': (data) => [data.submission_id, data.group_id, convertDate(data.timestamp), data.output_test !== undefined],
                    'archived_courses': (data) => [data.course_id, data.name, data.description, data.open_course],
                };

                const hashmap_get_to_function: { [key: string]: (project_id?: number) => Promise<any> } = {
                    'users': async () => {
                        return parse_pages(await getUsers(currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'course_students': async () => {
                        return parse_pages(await getStudents_by_course(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    "course_teachers": async () => {
                        return parse_pages(await getTeachers_by_course(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'courses': async () => {
                        return parse_pages(await getOpenCourses(currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'projects': async () => {
                        return parse_pages(await getProjects_by_course(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'groups': async () => {
                        return parse_pages(await getGroups_by_project(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'submissions': async () => {
                        return parse_pages(await getProjectSubmissions(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'submissions_group': async () => {
                        return parse_pages(await getGroupSubmissions(get_id, currentPage, page_size, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'archived_courses': async () => {
                        return parse_pages(await getArchivedCourses(currentPage, page_size, searchTerm));
                    }
                };

                // Get user data
                const user = await getUserData();
                setUser(user);

                if (get === 'groups') {
                    const project = await getProject(get_id);
                    setProject(project);
                }

                const data = await hashmap_get_to_function[get]();
                const mappedData = [];
                for (const d of data) {
                    mappedData.push(await hashmap_get_to_parser[get](d));
                }

                setRows(mappedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        // the values below will be constantly updated
    }, [searchTerm, currentPage, sortConfig, get, get_id, page_size]);


    const handleChangePage = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        // reset all checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });
    };

    const handleSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    };

    const CheckBoxWithCustomCheck = () => {
        const [checked, setChecked] = useState(false);
        const handleCheckboxChange = (event) => {
            setChecked(event.target.checked);
        };


        useEffect(() => {
            setChecked(false);
        }, [currentPage]);


        return (
            <Checkbox checked={checked} onChange={handleCheckboxChange} sx={{color:"black"}}/>
        );
    };

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <CssBaseline/>
            {search &&
                <TextField
                    label={search_text}
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e: { target: { value: any; }; }) => {
                        setCurrentPage(1);
                        setSearchTerm(e.target.value);
                        // reset all checkboxes
                        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach((checkbox) => {
                            (checkbox as HTMLInputElement).checked = false;
                        });
                    }}
                    InputLabelProps={{
                        style: {color: 'gray'}
                    }}
                    sx={{
                        width: '30%',
                        height: 'fit-content',
                        marginBottom: '16px',
                    }}
                />
            }
            {admin && action_name && action_name !== 'download_submission' && (
                <RemoveButton
                    onClick={() => {
                        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach((checkbox, index) => {
                            if ((checkbox as HTMLInputElement).checked) {
                                /**
                                 *
                                 *  EDIT
                                 *
                                 */
                                const id = rows[index][0];
                                if (!isNaN(id)) {
                                    if (!isNaN(id)) {
                                        if (action_name === 'remove_from_course') {
                                            postData('/users/' + id + '/remove_course_from_user/', {course_id: get_id})
                                                .then(() => {
                                                    window.location.reload();
                                                });
                                        } else if (action_name === 'remove') {
                                            deleteData('/users/' + id)
                                                .then(() => {
                                                    window.location.reload();
                                                });
                                        } else if (action_name === 'join_course') {
                                            postData('/courses/' + id + '/join_course/', {course_id: id})
                                                .then(() => {
                                                    window.location.href = '/course/' + id;
                                                });
                                        }
                                    }
                                } else {
                                    console.error("Invalid id", rows[index][0]);
                                }
                            }
                        });
                    }}
                >
                    {
                        action_text
                    }
                </RemoveButton>
            )}

            {admin && action_name && action_name === 'download_submission' && (
                <RemoveButton
                    onClick={() => {
                        const download_url = `${backend_url}/projects/${get_id}/download_submissions`
                        window.open(download_url, 'blank_')
                    }}
                >
                    Download all submissions
                </RemoveButton>
            )}

            {admin && action_name && action_name === 'download_submission' && (
                <RemoveButton
                    onClick={() => {
                        const selected_ids = Array.from(document.querySelectorAll('input[type="checkbox"]'))
                            .filter((checkbox) => (
                                (checkbox as HTMLInputElement).checked
                            ))
                            .map((checkbox, index) => (
                                rows[index][0]
                            ))

                        const download_url = `${backend_url}/submissions/download_selection?${
                            selected_ids
                                .map((id) => (`id=${id}`))
                                .join('&')
                        }`

                        window.open(download_url, 'blank_')
                    }}
                >
                    Download selected submissions
                </RemoveButton>
            )}
            <Paper
                sx={{
                    width: "100%",
                }}
            >
                <TableContainer component={Paper}>
                    <Table
                        sx={{
                            width: "100%",
                            borderRadius: '16px'
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {(get !== 'groups' && get !== 'projects' && !(get === 'submissions' && !action_name)) && get !== 'users' &&
                                    <StyledTableCell>
                                        <Typography
                                            variant={"body1"}
                                            sx={{
                                                color: 'primary.contrastText',
                                                display: 'inline-block',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {t('select')}
                                        </Typography>
                                    </StyledTableCell>}
                                {headers.map((header, index) =>
                                    <StyledTableCell key={index}>
                                        {sortable[index] &&
                                            <Button
                                                onClick={() => handleSort(headers_backend[index])}
                                                endIcon={
                                                    sortable[index] &&
                                                    sortConfig.key === headers_backend[index] ? (sortConfig.direction === 'asc' ?
                                                        <KeyboardArrowUpIcon sx={{color: "white"}}/> : <KeyboardArrowDownIcon sx={{color: "white"}}/>) : <KeyboardArrowUpIcon sx={{color: "primary.main"}}/>
                                                }
                                                sx={{
                                                    width: 'fit-content',
                                                    textAlign: 'left',
                                                    alignContent: 'left',
                                                    '&:hover': {
                                                        '.MuiButton-endIcon': {
                                                            '& svg': {
                                                                color: 'DarkGray',
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant={"body1"}
                                                    sx={{
                                                        color: 'primary.contrastText',
                                                        display: 'inline-block',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {header}
                                                </Typography>
                                            </Button>
                                         }
                                         {!sortable[index] &&
                                            <Typography
                                                variant={"body1"}
                                                sx={{
                                                    color: 'primary.contrastText',
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {header}
                                            </Typography>
                                            }
                                    </StyledTableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row, index) => (
                            <StyledTableRow key={index}>
                                {((get !== 'groups' && get !== 'projects' && !(get === 'submissions' && !action_name) && get != 'users') &&
                                    <StyledTableCell>
                                        {<CheckBoxWithCustomCheck checked={false}/>}
                                    </StyledTableCell>)}
                                {get === 'groups' && row.slice(2).map((cell, cellIndex) => (
                                    <StyledTableCell key={cellIndex}>{typeof cell == "boolean" ? (cell ? <CheckIcon/> :
                                        <CancelIcon/>) : cell}</StyledTableCell>
                                ))}
                                {get !== 'groups' && row.slice(1).map((cell, cellIndex) => (
                                    <StyledTableCell key={cellIndex}>{typeof cell == "boolean" ? (cell ? <CheckIcon/> :
                                        <CancelIcon/>) : cell}</StyledTableCell>
                                ))}
                                {
                                    // course leave button
                                    get === 'courses' && user.course.includes(row[0]) && (
                                        <StyledTableCell>
                                            <Button
                                                onClick={() => postData('/courses/' + row[0] + '/leave_course/', {course_id: row[0]}).then(() => window.location.reload())
                                                }>
                                                Leave
                                            </Button>
                                        </StyledTableCell>
                                    )
                                }
                                {
                                    // course join button
                                    get === 'courses' && (!user.course.includes(row[0])) && (
                                        <StyledTableCell>
                                            <Button
                                                onClick={() => postData('/courses/' + row[0] + '/join_course/', {course_id: row[0]}).then(() => window.location.href = '/course/' + row[0])
                                                }
                                                disabled={!row[3]}
                                                style={{backgroundColor: row[3] ? '' : 'gray'}}
                                            >
                                                Join
                                            </Button>
                                        </StyledTableCell>
                                    )
                                }
                                {
                                    // group join button
                                    get === 'groups' && (!row[1].includes(user.id)) && (
                                        <StyledTableCell>
                                            {
                                                // join button isn't shown when user is already in group
                                                // or when group is full
                                                // TODO i18n join button
                                                (user.role == 3) && (!user_is_in_group) && (row[1].length < project.group_size) && (
                                                    <Button
                                                        onClick={() => postData('/groups/' + row[0] + '/join/', {group_id: row[0]}).then(() => window.location.reload())
                                                        }>
                                                        Join
                                                    </Button>
                                                )
                                            }
                                        </StyledTableCell>)
                                }
                                {
                                    // group leave button
                                    get === 'groups' && (row[1].includes(user.id)) && (
                                        <StyledTableCell>
                                            {
                                                (user.role == 3) && (user_is_in_group) && (
                                                    <Button
                                                        onClick={() => postData('/groups/' + row[0] + '/leave/', {group_id: row[0]}).then(() => window.location.reload())
                                                        }>
                                                        Leave
                                                    </Button>
                                                )}
                                        </StyledTableCell>)
                                }
                                {get == 'projects' && (
                                    <StyledTableCell>
                                        <Button onClick={() => window.location.href = '/project/' + row[0]}>
                                            View
                                        </Button>
                                    </StyledTableCell>
                                )}
                                {(get == 'submissions' || get == 'submissions_group') && (
                                    <StyledTableCell>
                                        <Button onClick={() => window.location.href = '/submission/' + row[0]}>
                                            View
                                        </Button>
                                    </StyledTableCell>

                                )}
                                {get == 'users' && (
                                    <StyledTableCell>
                                        <Button onClick={() => window.location.href = '/admin/users/' + row[0] +'/edit'}>
                                            Edit
                                        </Button>
                                    </StyledTableCell>

                                )}
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box style={{display: 'flex', gap: '8px'}}>
                <Button
                    disabled={previousPage === 0}
                    onClick={() => handleChangePage('prev')}
                >
                    Prev
                </Button>
                <Button
                    disabled={nextPage === 0}
                    onClick={() => handleChangePage('next')}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}
export default ListView;