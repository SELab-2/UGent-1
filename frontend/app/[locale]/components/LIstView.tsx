import React from 'react';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { NextPage } from 'next';

const RootContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    height: theme.spacing(12),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const Table = styled('table')(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: '100%',
    borderCollapse: 'collapse',
    '& th, td': {
        border: '1px solid #ddd',
        padding: theme.spacing(1),
        textAlign: 'left',
    },
    '& th': {
        backgroundColor: '#f2f2f2',
    },
}));

interface ListViewProps {
    headers: string[];
    values: (string | number)[][];
}

const ListView: NextPage<ListViewProps> = ({ headers, values }) => {
    return (
        <RootContainer component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={LogoContainer}>
                <Typography variant="h2">ListView</Typography>
            </Box>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {values.map((row, index) => (
                        <tr key={index}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </RootContainer>
    );
};

export default ListView;
