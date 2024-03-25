"use client";
// @ts-ignore
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../../../i18n";
import BackButton from "../../../components/BackButton";
import {List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function ProjectDetailPage({params: {locale}} : {params: {locale: any}}) {
    const [project, setProject] = useState({}); // Initialize courses as an empty array
    const [translations, setTranslations] = useState({t: (key: any) => key}); // Default 't' function

    const files = [
        "extra/verslag.pdf",
        ".py"
    ];

    const conditions = [
        "Condition 1",
        "Condition 2"
    ]

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(backend_url + "/projects", {withCredentials: true});
                if (response.data && Array.isArray(response.data.results)) {
                    setProject(response.data.results); // Set courses to the results array
                } else {
                    console.error("Unexpected response structure:", response.data);
                    // Optionally handle unexpected structure
                }
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
                // Optionally handle the error, e.g., by setting an error message
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '64px', padding: '25px'}}>
                <BackButton text={"Return to course"} destination={"/teacher/course"}/>
                <Typography variant="h3" style={{fontWeight: 'bold', fontFamily: 'Inter'}}>
                    {"Project name"}
                </Typography>
                <Typography variant="h4" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '20px 0 20px 0'}}>
                    {"Assignment"}
                </Typography>
                <Box sx={{maxWidth: '60%'}}>
                    <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                    {"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos\n" +
                        "blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,\n" +
                        "neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum\n" +
                        "   quasi quidem quibusdam."}
                    </Typography>
                </Box>
                <Typography variant="h4" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '20px 0 20px 0'}}>
                    {"Project type"}
                </Typography>
                <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                    {"Individual"}
                    </Typography>
                <Typography variant="h4" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '20px 0 20px 0'}}>
                    {"Required files"}
                </Typography>
                <List>
                    {files.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <FiberManualRecordIcon style={{ color: 'black', fontSize: 'small'}} />
                            </ListItemIcon>
                            <ListItemText primary={`${file}`} />
                        </ListItem>
                    ))}
                </List>
                 <Typography variant="h4" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '20px 0 20px 0'}}>
                    {"Required conditions"}
                </Typography>
                <List>
                    {conditions.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <FiberManualRecordIcon style={{ color: 'black', fontSize: 'small'}} />
                            </ListItemIcon>
                            <ListItemText primary={`${file}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </div>
    );
}

export default ProjectDetailPage;