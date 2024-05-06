"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";

const ProjectSubmissionsList = ({project_id, page_size = 5}: {
    project_id: number,
    page_size: number
}) => {
    const headers = ["Group number", "Submission date", "Status", "View"]
    const headers_backend = ["group_nr", "submission_date", "status", "View"]
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
        />
    )
}

export default ProjectSubmissionsList;