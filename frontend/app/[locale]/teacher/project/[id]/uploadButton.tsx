import React from "react";
import JSZip, {JSZipObject} from "jszip";

function UploadTestFile(
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void,
    testfilesData: JSZipObject[],
    setTestfilesData: (value: (((prevState: JSZipObject[]) => JSZipObject[]) | JSZipObject[])) => void
) {
    const handleFileChange = async (event: any) => {
        let zip = new JSZip();
        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const fileReader = new FileReader();
            fileReader.onload = function (e) {
                zip.file(file.name, e.target?.result as ArrayBuffer);
            };
            fileReader.readAsArrayBuffer(file);
        }

        const zipFileBlob = await zip.generateAsync({type: "blob"});
        zip = new JSZip();
        const zipData = await zip.loadAsync(zipFileBlob);
        const testfiles_name: string[] = [...testfilesName];
        const testfiles_data: JSZipObject[] = [...testfilesData];
        zipData.forEach((relativePath, file) => {
            testfiles_data.push(file);
            testfiles_name.push(relativePath);
        });
        setTestfilesName(testfiles_name);
        setTestfilesData(testfiles_data);
    }

    return <>
        <input
            id="fileInput"
            type="file"
            style={{display: 'none'}}
            onChange={handleFileChange}
        />
        <button
            onClick={() => document.getElementById("fileInput")?.click()}
            style={{
                backgroundColor: '#D0E4FF',
                padding: '15px 30px',
                marginBottom: '30px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.2em',
            }}
        >
            Upload
        </button>
    </>;
}

export default UploadTestFile;