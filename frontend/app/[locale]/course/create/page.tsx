"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {postForm} from '@lib/api';
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";

function CourseCreatePage({params: {locale}}: { params: { locale: any } }) {
    const [selectedImage, setSelectedImage] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await fetch('../ugent_banner.png'); // Adjust the URL based on the image location
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const data = await response.blob();
                setSelectedImage(data);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImageData();
    }, []);

    const fetchTranslations = async () => {
        const {t, resources} = await initTranslations(locale, ["common"])
        setLoading(false);
    }

    const handleImageUpload = (event: any) => { //TODO should be able to select the right part of the image
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
    // TODO save and cancel button don't work

    return (

         <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar />
            <Box sx={{ marginTop: '64px' }}>
                <Box sx={{marginTop: '64px', position: 'relative'}}>
                    <button onClick={window.location.href = "/home"} style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'Arial, sans-serif',
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        fontSize: '16px'
                    }}>{t("Cancel")}
                    </button>
                    <Box sx={{marginLeft: '70px', marginRight: '70px', marginTop: '100px'}}>
                        <form onSubmit={postForm("/courses/")}>
                            <Box sx={{marginTop: '16px'}}>
                                <label htmlFor="name" style={{
                                    fontSize: '32px',
                                    fontFamily: 'Arial, sans-serif',
                                    marginBottom: '-10px',
                                    display: 'block'
                                }}>{t("Course name")}</label><br/>
                                <input type="text" id="name" name="name" required style={{
                                    fontSize: '20px',
                                    fontFamily: 'Arial, sans-serif',
                                    borderRadius: '6px',
                                    height: '30px',
                                    width: '220px'
                                }}/>
                            </Box>
                            <Box sx={{marginTop: '16px', borderRadius: '12px'}} style={{height: '250px'}}>
                                <label htmlFor="banner" style={{
                                    fontSize: '32px',
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#1E64C8'
                                }}>{t("Banner")}</label><br/>
                                <img src={selectedImage} alt="Image" style={{
                                    width: '100%',
                                    height: '220px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    borderRadius: '12px'
                                }}/>
                            </Box>
                            <Box sx={{marginTop: '16px'}}>
                                <label htmlFor="Image" style={{
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    padding: '8px 16px',
                                    border: '1px solid lightblue',
                                    borderRadius: '4px',
                                    backgroundColor: 'lightblue',
                                    color: '#1E64C8',
                                    fontFamily: 'Arial, sans-serif'
                                }}>
                                    {t("Select image")}
                                    <input type="file" id="Image" name="Image" accept="image/*" onChange={handleImageUpload}
                                           style={{display: 'none'}}/>
                                </label>
                            </Box>
                            <Box sx={{marginTop: '16px'}}>
                                <label htmlFor="description" style={{
                                    fontSize: '32px',
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#1E64C8',
                                    marginBottom: '-10px',
                                    display: 'block'
                                }}>{t("Description")}</label><br/>
                                <textarea id="description" name="description" rows={5} required style={{
                                    width: '100%',
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#1E64C8',
                                    borderRadius: '6px',
                                    padding: '10px'
                                }}/>
                            </Box>
                            <Box sx={{marginTop: '16px'}}>
                                <label htmlFor="choice" style={{
                                    fontSize: '32px',
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#1E64C8',
                                    marginBottom: '-10px',
                                    display: 'block'
                                }}>Access</label><br/>
                                <select id="choice" name="choice" style={{
                                    fontSize: '20px',
                                    fontFamily: 'Arial, sans-serif',
                                    borderRadius: '6px',
                                    padding: '5px'
                                }}>
                                    <option value="option1">{t("Private")}</option>
                                    <option value="option2">{t("Public")}</option>
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
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '16px',
                                    marginTop: '80px'
                                }}>{t("Save course")}</button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </TranslationsProvider>
    );

}

export default CourseCreatePage;
