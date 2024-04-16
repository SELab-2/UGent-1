"use client"
import { uploadSubmissionFile } from "@lib/api";
import { set } from "node_modules/cypress/types/lodash";
import {useEffect, useState} from "react";


export default function DropZone(){

    const [paths, setPaths] = useState<string[]>([]);
    
    function folderAdded(event : any){
        let newpaths = []
        for (const file of event.target.files) {
            let item = document.createElement("li");
            let text = file.webkitRelativePath;
            newpaths.push(text);
        }
        setPaths([...paths, ...newpaths]);
    }

    return (
        <section className="container">
            <form onSubmit={uploadSubmissionFile} encType="multipart/form-data">
                <input onChange={folderAdded} type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple />
                <input type="hidden" name="group_id" value="2" />
                
                <ul id="listing"></ul>

                <ul>
                    {paths.map(path => (
                    <li key={path}>{path}</li>
                    ))}
                </ul>

                <button type="submit">submit</button>
            </form>
        </section>
      );
}