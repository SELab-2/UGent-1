'use client'
import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Checkbox, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';
import checkMarkImage from './check-mark.png';
import { getUsers, deleteData, postData, getCourses, getGroups_by_project, getUserData, getUser, getProject } from '@lib/api';

const RootContainer = styled(Container)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[1],
    marginTop: '64px',
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

const ToggleButton = styled(Button)(({theme, selected}) => ({
    width: 'auto',
    alignSelf: 'flex-start',
    minWidth: 'fit-content', // Ensures the container fits its content
    padding: '5px 14px', // Add padding around the text (slightly bigger)
    position: 'relative',
    borderRadius: '20px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s ease',
    backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.main, // Background color reversed
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary, // Default text color
    '& span': {
        position: 'relative',
        zIndex: 1,
        transition: 'color 0.3s ease',
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: '-2px', // Adjust the top position for alignment
        left: selected ? 'calc(50% - 2px)' : '-2px', // Adjust left position for alignment
        width: 'calc(50% + 4px)', // Increase width to include padding for sliding component
        height: 'calc(100% + 4px)', // Increase height to include padding for sliding component
        backgroundColor: theme.palette.primary.light, // Sliding component color
        transition: 'left 0.3s ease',
        zIndex: 0,
        borderRadius: '20px',
    },
}));


const CheckBoxWithCustomCheck = () => {
    const [checked, setChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <GreenCheckbox checked={checked} onChange={handleCheckboxChange}>
            <CustomCheckmarkWrapper>
                {checked && <img src={checkMarkImage} alt="Checkmark"
                                 style={{width: '100%', height: '100%', objectFit: 'contain'}}/>}
            </CustomCheckmarkWrapper>
        </GreenCheckbox>
    );
};
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
    secondvalues?: (string | number)[][];
}

const ListView: NextPage<ListViewProps> = ({admin, get, get_id, headers, tablenames, action_name }) => {
    // default listview
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [rows, setRows] = useState<(string | number)[][]>([]);
    const [sortConfig, setSortConfig] = useState({ key: headers[0], direction: 'asc' });
    // student and user page
    const [secondvalueson, setSecondValuesOn] = useState(false);
    const [secondValues, setSecondValues] = useState<(string | number)[][]>([]);
    // group screen
    const [user, setUser] = useState<any>();
    const [user_is_in_group, setUserIsInGroup] = useState(false);
    const [project, setProject] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            try {

                /**
                 * 
                 *  EDIT
                 * 
                 */

                const hashmap_get_to_parser: { [key: string]: (data: any) => any[] | Promise<any[]> } = {
                    'users': (data) => [data.id, data.name, data.email, data.role],
                    'course_users': (data) => [data.id, data.name, data.email, data.role],
                    'courses': (data) => [data.course_id, data.name, data.description],
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
                    'users': getUsers,
                    'course_users':  async () => {
                        const users = await getUsers();
                        return users.filter((d: any) => d.course_id === get_id).filter((d: any) => d.role === 3);
                    },
                    'courses': getCourses,
                    'groups': async () => {
                        return getGroups_by_project(get_id);
                    }
                };

                const hashmap_get_to_secondvalues: { [key: string]: () => Promise<any> } = {
                    'users': async () => {
                        return undefined;
                    },
                    'course_users': async () => {
                        const users = await getUsers();
                        return users.filter((d: any) => d.course_id === get_id).filter((d: any) => d.role !== 3);
                    },
                    'courses': async () => {
                        return undefined;
                    },
                    'groups': async () => {
                        return undefined;
                    }
                };

                // Get user data
                const user = await getUserData();
                setUser(user);

                if(get === 'groups') {
                    const project = await getProject(get_id);
                    setProject(project);
                }

                let data = await hashmap_get_to_function[get]();
                const mappedData = [];
                for (const d of data) {
                    mappedData.push(await hashmap_get_to_parser[get](d));
                }
                if(hashmap_get_to_secondvalues[get]) {
                    const secondvalues = await hashmap_get_to_secondvalues[get]();
                    if(secondvalues) {
                        const mappedSecondValues = secondvalues.map(hashmap_get_to_parser[get]);
                        setSecondValues(mappedSecondValues);
                    }
                }

    
                // Calculate total pages based on filtered rows
                const totalItems = secondvalueson ? secondValues?.length : mappedData.length;
                setTotalPages(Math.ceil(totalItems / itemsPerPage));
    
                // Filter and slice rows based on current search term and page
                const filteredRows = secondvalueson ? secondValues : mappedData;
                const filteredAndSlicedRows = filteredRows
                    .filter(row => Array.isArray(row) && row.some(cell => cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())))
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                setRows(filteredAndSlicedRows);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        // the values below will be constan
    }, [currentPage, searchTerm, secondValues, secondvalueson]);
    

  const handleChangePage = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedRows = [...rows].sort((a, b) => {
        if (a[headers.indexOf(sortConfig.key)] < b[headers.indexOf(sortConfig.key)]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[headers.indexOf(sortConfig.key)] > b[headers.indexOf(sortConfig.key)]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleToggleSecondValues = () => {
        setSecondValuesOn(!secondvalueson);
    };

    return (
        <RootContainer component="main">
            <CssBaseline/>
            <SearchBar
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {admin && !secondvalueson && action_name && (
                <RemoveButton
                onClick={() => {
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach((checkbox, index) => {
                        if ((checkbox as HTMLInputElement).checked) {
                            // if secondvalues are on, use the secondvalues array
                            /**
                             * 
                             *  EDIT
                             * 
                             */
                            const id = sortedRows[index][0];
                            if (!isNaN(id)) {
                                if(action_name === 'remove_from_course') {
                                    postData('/users/' + id + '/remove_course_from_user/', {course_id: get_id});
                                } else if (action_name === 'remove') {
                                    deleteData('/users/' + id);
                                } else if (action_name === 'join_course') {
                                    postData('/courses/' + id + '/join_course/', {course_id: id});
                                }
                            } else {
                                console.error("Invalid id", sortedRows[index][0]);
                            }
                        }
                    });
                }}
            >
                {   // TODO i18n
                    action_name
                }
            </RemoveButton>

            )}
            {tablenames && (
                <ToggleButton onClick={handleToggleSecondValues} selected={secondvalueson}>
                    <span>{tablenames[0]}</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>{tablenames[1]}</span>
                </ToggleButton>
            )}
               <Table>
                <thead>
                    <tr>
                        {(get !== 'groups') && <th>Select</th>}
                        {headers.map((header, index) => (
                            <th key={index}>
                                <IconButton size="small" onClick={() => handleSort(header)}>
                                    {sortConfig.key === header ? (sortConfig.direction === 'asc' ? <WhiteTriangleUpIcon /> : <WhiteTriangleDownIcon />) : <WhiteSquareIcon />}
                                </IconButton>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map((row, index) => (
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
                            // group join button
                            get === 'groups' && (!row[1].includes(user.id)) && (
                                <td>
                                    {
                                    // join button isn't shown when user is already in group
                                    // or when group is full
                                    // TODO i18n join button
                                    (!user_is_in_group) && (row[1].length < project.group_size) && (
                                    <Button onClick={() => postData('/groups/' + row[0] + '/join/', {group_id: row[0]})}>
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
                                    <Button onClick={() => postData('/groups/' + row[0] + '/leave/', {group_id: row[0]})}>
                                        Leave
                                    </Button>
                                    )}
                                </td>)
                            }
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            {totalPages > 1 &&  (
                <Box>
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => handleChangePage('prev')}
                    >
                        Prev
                    </Button>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => handleChangePage('next')}
                    >
                        Next
                    </Button>
                </Box>
            )}
        </RootContainer>
    );
}
export default ListView;