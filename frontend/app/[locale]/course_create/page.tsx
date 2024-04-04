"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";
import {postForm} from '@lib/api';


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
    // TODO is choicebox still needed?
    // TODO save and remove button don't work
    return (
        <div>
            <NavBar />
            <Box sx={{ marginTop: '64px', position: 'relative' }}>
                <button style={{backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Arial, sans-serif', position: 'absolute', top: '20px', right: '20px', fontSize: '16px' }}>Remove course</button>
                <Box sx={{ marginLeft: '70px', marginRight: '70px', marginTop: '100px' }}>
                    <form onSubmit={postForm("/courses/")}>
                        <Box sx={{ marginTop: '16px' }}>
                            <label htmlFor="name" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue', marginBottom: '-10px', display: 'block'  }}>{translations.t("Course name")}</label><br />
                            <input type="text" id="name" name="name" required style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif', borderRadius: '6px', height: '30px', width: '220px' }} />
                        </Box>
                        <Box sx={{ marginTop: '16px', overflow: 'auto', borderRadius: '12px' }} style={{ height: '200px' }}>
                            <label htmlFor="banner" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue' }}>{translations.t("Banner")}</label><br />
                            <img src={selectedImage} alt="Profile Image" style={{ width: '100%', height: 'auto', borderRadius: '12px' }}/>
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
                            <label htmlFor="description" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue', marginBottom: '-10px', display: 'block' }}>{translations.t("Description")}</label><br />
                            <textarea id="description" name="description" rows={5} required style={{width: '100%', fontFamily: 'Arial, sans-serif', color: 'darkblue', borderRadius: '6px', padding: '10px' }}/>
                        </Box>
                        <Box sx={{ marginTop: '16px' }}>
                            <label htmlFor="choice" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', color: 'darkblue', marginBottom: '-10px', display: 'block' }}>Access</label><br />
                            <select id="choice" name="choice" style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif', borderRadius: '6px', padding: '5px' }}>
                                <option value="option1">Request access</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </Box>
                        <Box sx={{ marginTop: '16px', position: 'absolute' }}>
                            <button type="submit" style={{backgroundColor: 'blue', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontSize: '16px', marginTop: '80px' }}>{translations.t("Save course")}</button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </div>
    );

}

export default CourseCreatePage;
