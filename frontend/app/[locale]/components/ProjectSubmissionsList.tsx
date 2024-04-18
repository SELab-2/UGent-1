"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";

const ProjectSubmissionsList = ({project_id}: { project_id: number }) => {
    const headers = ["Group number", "Submission date", "Status"]
    const sortable = [true, true, false]

    return (
        <ListView
            admin={true}
            headers={headers}
            get={'submissions'}
            get_id={project_id}
            sortable={sortable}
            action_name={'download_submission'}
        />
    )
}

export default ProjectSubmissionsList;