"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";

const ProjectSubmissionsList = ({project_id}: { project_id: number }) => {
    const headers = ["Group number", "Submission date", "Status"]

    return (
        <ListView
            admin={false}
            headers={headers}
            get={'submissions'}
            get_id={project_id}
        />
    )
}

export default ProjectSubmissionsList;