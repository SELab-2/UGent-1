'use client'
import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Checkbox, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';
import checkMarkImage from './check-mark.png';
import { getUsers, deleteData, postData, getCourses, getGroups_by_project, getUserData, getUser, getProject, getStudents_by_course, getTeachers_by_course } from '@lib/api';

const RootContainer = styled(Container)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[1],
    marginTop: '20px',
    width: '75%',
    maxWidth: '100%',
}));

const Table = styled('table')(({theme}) => ({
    marginTop: theme.spacing(2),
    width: '100%',
    borderCollapse: 'collapse',
    '& th, td': {
        border: '1px solid #ddd',
        padding: theme.spacing(1),
        textAlign: 'left',
        height: '24px',
    },
    '& th': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        fontSize: '14px',
    },
}));

const TableRow = styled('tr')(({theme}) => ({
    '&:nth-child(even)': {
        backgroundColor: theme.palette.background.default,
    },
    '&:nth-child(odd)': {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const GreenCheckbox = styled(Checkbox)(({theme}) => ({
    color: theme.palette.success.main,
    '&.Mui-checked': {
        color: theme.palette.success.main,
    },
}));

const CustomCheckmarkWrapper = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
});

const WhiteSquareIcon = () => (
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="12" height="12" fill="white"/>
</svg>
);

const WhiteTriangleUpIcon = () => (
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L12 0L0 0L6 12Z" fill="white"/>
</svg>
);

const WhiteTriangleDownIcon = () => (
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0L12 12L0 12L6 0Z" fill="white"/>
</svg>
);


const SearchBar = styled(TextField)({
    marginBottom: '16px',
    width: '50%', // Adjust the width to cover only 50% of the container
});

const RemoveButton = styled(Button)({
    marginBottom: '16px',
    alignSelf: 'flex-end',
    fontSize: '0.8rem',
    minWidth: 'auto',
    width: 'auto',
});

interface ListViewProps {
    headers: string[];
    values: (string | number)[][];
}

const ListView: NextPage<ListViewProps> = ({admin, get, get_id, headers, sortable, action_name, action_text, search_text }) => {
    // default listview
    const [searchTerm, setSearchTerm] = useState('');
    const [rows, setRows] = useState<(string | number)[][]>([]);
    const [sortConfig, setSortConfig] = useState({ key: headers[0], direction: 'asc' });
    // group screen
    const [user, setUser] = useState<any>();
    const [user_is_in_group, setUserIsInGroup] = useState(false);
    const [project, setProject] = useState<any>();
    // multiple pages
    const [currentPage, setCurrentPage] = useState(1);
    const [previousPage, setPreviousPage] = useState(0);
    const [nextPage, setNextPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {

                /**
                 * 
                 *  EDIT
                 * 
                 */

                const parse_pages = (response: any) => {
                    if(response.previous){
                        setPreviousPage(1);
                    } else {
                        setPreviousPage(0);
                    }
                    if(response.next){
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
                    'groups': async (data) => {
                        let l = [];
                        // Iterate over the values of the object
                        for (const user_id of Object.values(data.user)) {
                            const i = await getUser(Number(user_id));
                            if(i.id === user.id) {
                                setUserIsInGroup(true);
                            }
                            l.push(i.email);
                        }
                        return [data.group_id, data.user, data.group_nr, l.join(', ')];
                    }
                    
                };

                const hashmap_get_to_function: { [key: string]: (project_id?: number) => Promise<any> } = {
                    'users': async () => {
                        return parse_pages(await getUsers(currentPage));
                    },
                    'course_students': async () => {
                        return parse_pages(await getStudents_by_course(get_id, currentPage));
                    },
                    "course_teachers": async () => {
                        return parse_pages(await getTeachers_by_course(get_id, currentPage));
                    },
                    'courses': async () => {
                        return parse_pages(await getCourses(currentPage, 5, searchTerm, sortConfig.key.toLowerCase(), sortConfig.direction === 'asc' ? 'asc' : 'desc'));
                    },
                    'groups': async () => {
                        return parse_pages(await getGroups_by_project(get_id, currentPage));
                    }
                };

                // Get user data
                const user = await getUserData();
                setUser(user);

                if(get === 'groups') {
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
    }, [currentPage, searchTerm, currentPage, sortConfig]);
    

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
        setSortConfig({ key, direction });
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
            <GreenCheckbox checked={checked} onChange={handleCheckboxChange}>
                <CustomCheckmarkWrapper>
                    {checked && <img src={checkMarkImage} alt="Checkmark"
                                     style={{width: '100%', height: '100%', objectFit: 'contain'}}/>}
                </CustomCheckmarkWrapper>
            </GreenCheckbox>
        );
    };

    return (
        <RootContainer component="main">
            <CssBaseline/>
            <SearchBar
                label={search_text}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {admin && action_name && (
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
                                    if(action_name === 'remove_from_course') {
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
               <Table>
                <thead>
                    <tr>
                        {(get !== 'groups') && <th>Select</th>}
                        {headers.map((header, index) => 
                            <th key={index}>
                                {sortable[index] &&
                                <IconButton size="small" onClick={() => handleSort(headers[index])}>
                                    {sortConfig.key === headers[index] ? (sortConfig.direction === 'asc' ? <WhiteTriangleUpIcon /> : <WhiteTriangleDownIcon />) : <WhiteSquareIcon />}
                                </IconButton>
                                }
                                {header}
                            </th>
                        )})
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            {((get !== 'groups') &&
                            <td>
                                {<CheckBoxWithCustomCheck checked={false}/>}
                            </td>)}
                            {get === 'groups' && row.slice(2).map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                            {get !== 'groups' && row.slice(1).map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                            {   
                                // course leave button
                                get === 'courses' && user.course.includes(row[0]) && (
                                    <td>
                                        <Button onClick={() => postData('/courses/' + row[0] + '/leave_course/', {course_id: row[0]})}>
                                            Leave
                                        </Button>
                                    </td>
                                )
                            }
                            {
                                // course join button
                                get === 'courses' && (!user.course.includes(row[0])) && (
                                    <td>
                                        <Button onClick={() => postData('/courses/' + row[0] + '/join_course/', {course_id: row[0]})}
                                        disabled={!row[3]} 
                                        style={{backgroundColor: row[3] ? '': 'gray'}}
                                        >
                                            Join
                                        </Button>
                                    </td>
                                )
                            }
                            { 
                            // group join button
                            get === 'groups' && (!row[1].includes(user.id)) && (
                                <td>
                                    {
                                    // join button isn't shown when user is already in group
                                    // or when group is full
                                    // TODO i18n join button
                                    (!user_is_in_group) && (row[1].length < project.group_size) && (
                                    <Button onClick={() => postData('/groups/' + row[0] + '/join/', {group_id: row[0]}).then(() => window.location.reload())
                                    }>
                                        Join
                                    </Button>
                                    )
                                    }
                                </td>)
                            }
                            { 
                            // group leave button
                            get === 'groups' && (row[1].includes(user.id)) && (
                                <td>
                                    {
                                    (user_is_in_group) && (
                                    <Button onClick={() => postData('/groups/' + row[0] + '/leave/', {group_id: row[0]}).then(() => window.location.reload())
                                    }>
                                        Leave
                                    </Button>
                                    )}
                                </td>)
                            }
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            <Box style={{ display: 'flex', gap: '8px' }}>
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
        </RootContainer>
    );
}
export default ListView;