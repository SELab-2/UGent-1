import React from 'react';
// @ts-ignore
const BackButton = ({text, destination}) => {
  const handleClick = () => {
    // TODO change to teacher/course (saved in destination)
    window.location.href = "/home";
  };

  return (
    <button
      style={{
        backgroundColor: '#D0E4FF',
        borderRadius: '10px',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        margin: '0 0 20px 0'
      }}
      onClick={handleClick}
    >
      <span style={{ marginRight: '10px' }}>{'<'}</span> {/* Back Arrow */}
      <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Quicksand'}}>{text}</span>
    </button>
  );
};

export default BackButton;
