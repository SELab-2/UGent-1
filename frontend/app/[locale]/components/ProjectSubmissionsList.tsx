"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";
import {useTranslation} from "react-i18next";
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const ProjectSubmissionsList = ({project_id, page_size = 5, search}: {
        project_id: number,
        page_size: number,
        search: string
    }) => {
    /*
    * This component is the list of submissions that is displayed on the project page.
    * @param project_id: The id of the project
    * @param page_size: The number of submissions to display per page
    * @param search: The search text to filter submissions
    */
    const {t} = useTranslation()
    const headers = [
        <React.Fragment key="group_nr"><GroupsIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('group_number')}</React.Fragment>
        ,
        <React.Fragment key="submission_date"><CalendarMonthIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('submission_date')}</React.Fragment> 
        ,
        <React.Fragment key="status"><CheckCircleOutlineIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('Status')}</React.Fragment> 
        , ""]
    const headers_backend = ["group_nr", "submission_date", "status", ""]
    const sortable = [true, true, false]

    return (
        <ListView
            admin={true}
            headers={headers}
            headers_backend={headers_backend}
            get={'submissions'}
            get_id={project_id}
            sortable={sortable}
            action_name={'download_submission'}
            page_size={page_size}
            search_text={search}
        />
    )
}

export default ProjectSubmissionsList;