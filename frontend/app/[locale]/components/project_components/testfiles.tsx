import React from 'react';
import { Typography, List, ListItem, IconButton, ListItemAvatar, Avatar, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';

interface TestFilesProps {
  testfiles: string[];
  setTestfiles: React.Dispatch<React.SetStateAction<string[]>>;
}

const TestFiles: React.FC<TestFilesProps> = ({ testfiles, setTestfiles }) => {
  return (
    <>
      <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
        {"Testfiles"}
      </Typography>
      <List dense={true}>
        {testfiles.map((testfile, index) => (
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  const newTestfiles = [...testfiles];
                  newTestfiles.splice(index, 1);
                  setTestfiles(newTestfiles);
                }}
              >
                <DeleteIcon/>
              </IconButton>
            }
            key={index}
          >
            <ListItemAvatar>
              <Avatar>
                <DescriptionIcon/>
              </Avatar>
            </ListItemAvatar>
            <Link href={"/home"}>
              {testfile}
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default TestFiles;