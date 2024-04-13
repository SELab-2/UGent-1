"use client"
import {postForm} from "@lib/api";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import banner from '../../../public/ugent_banner.png'
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

const i18nNamespaces = ['common']

const CreateCourseForm = () => {
    const [translations, setTranslations] = useState<{
        t: ((key: string) => string),
        resources: any,
        locale: string,
        i18nNamespaces: string[]
    }>
    ({t: (key: string) => key, resources: null, locale: "en", i18nNamespaces: [""]})
    const [selectedImage, setSelectedImage] = useState(banner);

    useEffect(() => {
        const fetchTranslations = async () => {
            const url = window.location.pathname;
            const locale = url.split('/')[1];
            const {t, resources} = await initTranslations(locale, i18nNamespaces)
            setTranslations({t, resources, locale, i18nNamespaces})
        }

        fetchTranslations();
    }, []);

    const handleSubmit = async (event: any) => {
        postForm("/courses/");
    }
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

    return (
        <TranslationsProvider
            resources={translations.resources}
            locale={translations.locale}
            namespaces={["common"]}
        >
            <form onSubmit={handleSubmit}>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="name" style={{
                        fontSize: '32px',
                        fontFamily: 'Arial, sans-serif',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>{translations.t("Course name")}</label><br/>
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
                    }}>{translations.t("Banner")}</label><br/>
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
                                src={selectedImage}
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
                        color: '#1E64C8',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {translations.t("Select image")}
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
                    <textarea id="description" name="description" rows={5} required style={{
                        width: '100%',
                        fontFamily: 'Arial, sans-serif',
                        color: '#1E64C8',
                        borderRadius: '6px',
                        padding: '10px',
                        boxSizing: 'border-box'
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
                        <option value="option1">{translations.t("Private")}</option>
                        <option value="option2">{translations.t("Public")}</option>
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
                    }}>{translations.t("Save course")}</button>
                </Box>
            </form>
        </TranslationsProvider>
    )
}

export default CreateCourseForm