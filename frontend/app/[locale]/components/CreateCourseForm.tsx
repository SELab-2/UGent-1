"use client"
import {postData} from "@lib/api";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import banner from '../../../public/ugent_banner.png'

const CreateCourseForm = () => {
    const {t} = useTranslation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string>("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);

    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);

        const imageURL = URL.createObjectURL(imageFile);
        setSelectedImageURL(imageURL);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('open_course', open.toString());
        const fileReader = new FileReader();
         fileReader.onload = async function() {
            const arrayBuffer = this.result;
            if (arrayBuffer !== null) {
                formData.append('banner', new Blob([arrayBuffer], {type: 'image/png'}));
                await postData("/courses/", formData).then((response) => {
                    window.location.href = `/course/${response.course_id}`;
                });
            }
        }
        if (selectedImage) fileReader.readAsArrayBuffer(selectedImage);
    }

    useEffect(() => {
        if (selectedImage === null) {
            fetch(banner.src)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], "filename", {type: "image/png"});
                    setSelectedImage(file);
                    setSelectedImageURL(banner.src)
                })
        }
    }, [selectedImageURL, selectedImage]);

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="name" style={{
                    fontSize: '32px',
                    fontFamily: 'Quicksand',
                    marginBottom: '-10px',
                    display: 'block'
                }}>{t("course name")}</label><br/>
                <input type="text" id="name" name="name" required
                       onChange={(event: any) => setName(event.target.value)} style={{
                    fontSize: '20px',
                    fontFamily: 'Quicksand',
                    borderRadius: '6px',
                    height: '30px',
                    width: '400px'
                }}/>
            </Box>
            <Box sx={{marginTop: '16px', borderRadius: '12px'}} style={{height: '250px'}}>
                <label htmlFor="banner" style={{
                    fontSize: '32px',
                    fontFamily: 'Quicksand',
                    color: 'black'
                }}>{t("banner")}</label><br/>
                <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        <Image
                            src={selectedImageURL}
                            alt="Image"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </Box>
            <Box>
                <label htmlFor="Image" style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid lightblue',
                    borderRadius: '4px',
                    backgroundColor: 'lightblue',
                    color: 'black',
                    fontFamily: 'Quicksand'
                }}>
                    {t("select image")}
                    <input type="file" id="Image" name="Image" accept="image/*" onChange={handleImageUpload}
                           style={{display: 'none'}}/>
                </label>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="description" style={{
                    fontSize: '32px',
                    fontFamily: 'Quicksand',
                    color: 'black',
                    marginBottom: '-10px',
                    display: 'block'
                }}>{t("description")}</label><br/>
                <textarea id="description" name="description" rows={5}
                          onChange={(event: any) => setDescription(event.target.value)} required style={{
                    width: '100%',
                    fontFamily: 'Quicksand',
                    color: 'black',
                    borderRadius: '6px',
                    padding: '10px',
                    boxSizing: 'border-box'
                }}/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="choice" style={{
                    fontSize: '32px',
                    fontFamily: 'Quicksand',
                    color: 'black',
                    marginBottom: '-10px',
                    display: 'block'
                }}>{t("access")}</label><br/>
                <select id="choice" name="choice" onChange={(event) => (setOpen(event.target.value === 'true'))}
                        style={{
                            fontSize: '20px',
                            fontFamily: 'Quicksand',
                            borderRadius: '6px',
                            padding: '5px'
                        }}>
                    <option value="false">{t("private")}</option>
                    <option value="true">{t("public")}</option>
                </select>
            </Box>
            <Box sx={{marginTop: '16px', position: 'absolute'}}>
                <button type="submit" style={{
                    backgroundColor: '#1E64C8',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Quicksand',
                    fontSize: '16px',
                    marginTop: '80px'
                }}>{t("save course")}</button>
                <button
                    onClick={() => window.location.href = '/home/'}
                    style={{
                        backgroundColor: '#1E64C8',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'Quicksand',
                        fontSize: '16px',
                        marginTop: '80px',
                        marginLeft: '15px'
                    }}>{t("cancel")}</button>
            </Box>
        </form>
    )
}

export default CreateCourseForm