import React, { useState } from 'react';
import { Box, Container, CssBaseline, Checkbox, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';
import checkMarkImage from './check-mark.png';

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
}

const ListView: NextPage<ListViewProps> = ({ admin, headers, values }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = values.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChangePage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredValues = values.filter(value =>
    value.some(cell => (cell ?? '').toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentValues = filteredValues.slice(startIndex, endIndex);

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
      {admin && ( // Conditionally render the RemoveButton based on the admin prop
        <RemoveButton variant="contained" color="error" size="small">
          Remove
        </RemoveButton>
      )}
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
          {currentValues.map((row, index) => (
            <TableRow key={index}>
              <td>
                <CheckBoxWithCustomCheck checked={false} /> {/* Use the custom checkbox component */}
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
};

export default ListView;