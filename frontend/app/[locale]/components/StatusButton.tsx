import ClearIcon from '@mui/icons-material/Clear';
import React, {useState} from 'react';
import CheckIcon from "@mui/icons-material/Check";
import {Button} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface StatusButtonProps {
    files: any[],
    setFiles: (value: (((prevState: any[]) => any[]) | any[])) => void,
    fileIndex: number,
}

function StatusButton(
    {files, setFiles, fileIndex}: StatusButtonProps,
) {
  const [statusIndex, setStatusIndex] = useState(getStart(files[fileIndex]));
  const statuses = [
    { icon: <CheckIcon style={{ color: '#66bb6a' }} /> },
    { icon: <HelpOutlineIcon style={{ color: '#000000' }} />},
    { icon: <ClearIcon style={{ color: '#ef5350' }} /> },
  ];
  const status_valeus = ['+', '~', '-'];

  const handleClick = () => {
      const newStatusIndex = (statusIndex + 1) % statuses.length;
      setStatusIndex(newStatusIndex);
      const newFiles = [...files];
      newFiles[fileIndex] = status_valeus[newStatusIndex];
      setFiles(newFiles);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
          border: 'none',
          backgroundColor: 'transparent',
          minWidth: '30px',  // Ensure the button is square by setting equal width and height
          minHeight: '30px',  // Adjust the size as needed
          padding: 0,
          margin: 1,
      }}
    >
      {statuses[statusIndex].icon}
    </Button>
  );
}

function getStart(file: string | undefined) {
    if (!file || file.length === 0) {
        return 2;
    }

    if (file[0] === '+') {
        return 0;
    } else if (file[0] === '~') {
        return 1;
    } else {
        return 2;
    }
}

export default StatusButton;