import React from 'react';
import { Checkbox } from '@mui/material';


interface CustomCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<></>} // Empty icon when not checked
      checkedIcon={<img src="/check-mark.png" alt="check-mark" style={{ width: '100%', height: '100%' }} />} // Image when checked
    />
  );
};

export default CustomCheckbox;
