"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../../i18n";
import ugent_banner from "@app/[locale]/course/ugent_banner.png"; // TODO move image to resources

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function CourseEditPage({ params: { locale, id } }: { params: { locale: any, id: string } }) {
    const [translations, setTranslations] = useState({ t: (key: any) => key });
    const [courseData, setCourseData] = useState({ name: '', description: '' });
    const [selectedImage, setSelectedImage] = useState(ugent_banner);


    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(backend_url + "/courses/" + id, { withCredentials: true });
                if (response.data) {
                    setCourseData(response.data);
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            } catch (error) {
                console.error("There was an error fetching the course data:", error);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleRemoveCourse = () => {
        try {
            axios.delete(backend_url + "/courses/" + id, { withCredentials: true });
            alert('Course removed successfully!');
        } catch (error) {
            console.error("There was an error removing the course:", error);
            alert('An error occurred. Please try again later.');
        }
    };

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

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());

        try {
            await axios.put(backend_url + "/courses/" + id + "/", formDataObject, { withCredentials: true });
            alert('Course updated successfully!');
        } catch (error) {
            console.error("There was an error updating the course:", error);
            alert('An error occurred. Please try again later.');
        }
    };

    // TODO is choicebox still needed?
    // TODO save and remove button don't work
    // TODO add translations (and style)
    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '64px', position: 'relative'}}>
                <button onClick={handleRemoveCourse} style={{
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
                }}>Remove course
                </button>
                <Box sx={{marginLeft: '70px', marginRight: '70px', marginTop: '100px'}}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{marginTop: '16px'}}>
                            <label htmlFor="name" style={{
                                fontSize: '32px',
                                fontFamily: 'Arial, sans-serif',
                                marginBottom: '-10px',
                                display: 'block'
                            }}>{translations.t("Course name")}</label><br/>
                            <input type="text" id="name" name="name" defaultValue={courseData.name} required style={{
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
                            }}>{translations.t("Banner")}</label><br/>
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
                                Select image
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
                            }}>{translations.t("Description")}</label><br/>
                            <textarea id="description" name="description" rows={5} defaultValue={courseData.description} required style={{
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
                                <option value="option1">Request access</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
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
                            }}>{translations.t("Save changes")}</button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </div>
    );
}

export default CourseEditPage;
