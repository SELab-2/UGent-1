"use client"
import { set } from "node_modules/cypress/types/lodash";
import {useEffect, useState} from "react";


export default function DropZone(){

    const [paths, setPaths] = useState<string[]>([]);
    
    function folderAdded(event : any){
        let output = document.getElementById("listing");
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
            <input onChange={folderAdded} type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple />
            <ul id="listing"></ul>

            <ul>
                {paths.map(path => (
                <li key={path}>{path}</li>
                ))}
            </ul>

            <h4>egg wooohhh</h4>
        </section>
      );
}