import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Checkbox, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';
import checkMarkImage from './check-mark.png';
import { useTheme } from '@mui/material/styles';



const RootContainer = styled(Container)(({ theme }) => ({
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

const Table = styled('table')(({ theme }) => ({
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

const TableRow = styled('tr')(({ theme }) => ({
    '&:nth-child(even)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:nth-child(odd)': {
      backgroundColor: theme.palette.secondary.main,
    },
  }));
  
const GreenCheckbox = styled(Checkbox)(({ theme }) => ({
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

   const ToggleButton = styled(Button)(({ theme, selected }) => ({
    width: 'auto',
    alignSelf:  'flex-start',
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
           {checked && <img src={checkMarkImage} alt="Checkmark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
         </CustomCheckmarkWrapper>
       </GreenCheckbox>
    );
   };
   

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

const ListView: NextPage<ListViewProps> = ({ admin, headers, values, secondvalues }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [secondvalueson, setSecondValuesOn] = useState(false); 
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(Math.ceil(values.length / itemsPerPage));
  const [rows, setRows] = useState<(string | number)[][]>([]);
  const theme = useTheme();

  useEffect(() => {
    const totalItems = secondvalueson ? secondvalues?.length : values.length;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setRows(secondvalueson ? secondvalues?.slice(startIndex, endIndex) : values.slice(startIndex, endIndex));
  }, [currentPage, searchTerm, secondvalues, secondvalueson, values]);
  
  const handleChangePage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleSecondValues = () => {
    setSecondValuesOn(!secondvalueson);
  };

  return (
    <RootContainer component="main">
      <CssBaseline />
      <SearchBar
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {admin && (
        <RemoveButton variant="contained" color="error" size="small">
          Remove
        </RemoveButton>
      )}
      <ToggleButton onClick={handleToggleSecondValues} selected={secondvalueson}>
        <span>First Values</span>
        {/* bit of horizontal space */ }
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>Second Values</span>
      </ToggleButton>
      <Table>
        <thead>
          <tr>
            <th>Select</th>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <td>
                {secondvalueson && <CheckBoxWithCustomCheck checked={false} />}
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