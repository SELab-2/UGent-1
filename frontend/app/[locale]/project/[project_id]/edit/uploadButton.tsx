import React from "react";
import JSZip, {JSZipObject} from "jszip";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function UploadTestFile(
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void,
    testfilesData: JSZipObject[],
    setTestfilesData: (value: (((prevState: JSZipObject[]) => JSZipObject[]) | JSZipObject[])) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
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

    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <input
            id="fileInput"
            type="file"
            className={"uploadInput"}
            onChange={handleFileChange}
        />
        <button
            onClick={() => document.getElementById("fileInput")?.click()}
            className={"uploadButton"}
        >
            {translations.t("upload")}
        </button>
    </TranslationsProvider>;
}

export default UploadTestFile;