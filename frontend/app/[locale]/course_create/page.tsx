"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function CourseCreatePage({ params: { locale } }: { params: { locale: any } }) {
    const [translations, setTranslations] = useState({ t: (key: any) => key });
    const [selectedImage, setSelectedImage] = useState('/path/to/default-image.jpg'); // TODO Default image


    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            // Update the selectedImage state with the uploaded image data URL
            setSelectedImage(reader.result);
        };

        // Read the uploaded image as a data URL
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        console.log(formDataObject)
        try {
            await axios.post(backend_url + "/courses/", formDataObject, { withCredentials: true });
            alert('Course created successfully!');
        } catch (error) {
            console.error("There was an error creating the course:", error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <NavBar />
            <Box sx={{ marginTop: '64px' }} style={{ marginLeft: '40px', marginRight: '40px', marginTop: '100px'  }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="name" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue' }}>{translations.t("Course name")}</label><br />
                        <input type="text" id="name" name="name" required style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }} />
                    </Box>
                    <Box sx={{marginTop: '32px', overflow: 'auto'}} style={{height: '200px'}}>
                        <label htmlFor="banner" style={{fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue'}}>{translations.t("Banner")}</label><br/>
                        <img src={selectedImage} alt="Profile Image" style={{width: '100%', height: 'auto'}}/>
                    </Box>
                    <Box sx={{marginTop: '16px'}}>
                        <label htmlFor="profileImage" style={{
                            cursor: 'pointer',
                            color: 'black', display: 'inline-block', padding: '8px 16px', border: '1px solid lightblue', borderRadius: '4px', backgroundColor: 'lightblue', color: 'darkblue', fontFamily: 'Arial, sans-serif' }}>
                            Select image
                            <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="description" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue' }}>{translations.t("Description")}</label><br />
                        <textarea id="description" name="description" rows={6} required style={{width: '100%', fontFamily: 'Arial, sans-serif', color: 'darkblue', }}/>
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <button type="submit" style={{backgroundColor: 'blue', color: 'darkblue', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Arial, sans-serif'}}>{translations.t("Save")}</button>
                    </Box>
                </form>
            </Box>
        </div>
    );

}

export default CourseCreatePage;
