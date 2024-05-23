import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadTestFile from '@app/[locale]/components/project_components/uploadButton';

describe('UploadTestFile', () => {
  test('uploads files correctly', async () => {
    const setTestfilesName = jest.fn();
    const setTestfilesData = jest.fn();
    const files = [
      new File(['test file 1'], 'testfile1.txt', { type: 'text/plain' }),
      new File(['test file 2'], 'testfile2.txt', { type: 'text/plain' })
    ];

    render(
      <UploadTestFile
        testfilesName={['testfile1.txt', 'testfile2.txt']}
        setTestfilesName={setTestfilesName}
        testfilesData={[]}
        setTestfilesData={setTestfilesData}
      />
    );

    const input = screen.getByText('upload');
    fireEvent.change(input, { target: { files } });

  });
});
