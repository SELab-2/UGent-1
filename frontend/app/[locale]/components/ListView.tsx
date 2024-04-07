import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Checkbox, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';
import checkMarkImage from './check-mark.png';
import { useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


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

const ListView: NextPage<ListViewProps> = ({admin, headers, values, secondvalues, tablenames, action, action_name}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [secondvalueson, setSecondValuesOn] = useState(false);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(Math.ceil(values.length / itemsPerPage));
    const [rows, setRows] = useState<(string | number)[][]>([]);
    const [sortConfig, setSortConfig] = useState({ key: headers[0], direction: 'asc' });

    useEffect(() => {
      const totalItems = secondvalueson ? secondvalues?.length : values.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      const filteredRows = secondvalueson ? secondvalues : values;
      const filteredAndSlicedRows = filteredRows
  .filter(row => row.some(cell => cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())))
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setRows(filteredAndSlicedRows);
  }, [currentPage, searchTerm, secondvalues, secondvalueson, values]);

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
            {admin && action && (
                <RemoveButton
                onClick={() => {
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach((checkbox, index) => {
                        if ((checkbox as HTMLInputElement).checked) {
                            // if secondvalues are on, use the secondvalues array
                            const courseId = secondvalueson ? secondvalues[index][0] : values[index][0];
                            if (!isNaN(courseId)) {
                                action(courseId);
                            } else {
                                console.error("Invalid course ID:", values[index][0]);
                            }
                        }
                    });
                }}
            >
                {action_name || 'Remove'}
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
                        <th>Select</th>
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
                            <td>
                                {<CheckBoxWithCustomCheck checked={false}/>}
                            </td>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            {totalPages > 1 && (
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