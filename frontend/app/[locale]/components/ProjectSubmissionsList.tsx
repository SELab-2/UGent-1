"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";

const ProjectSubmissionsList = ({project_id, showActions, page_size=5}: { project_id: number, showActions: boolean, page_size: number }) => {
    const headers = ["Group number", "Submission date", "Status"]
    const sortable = [true, true, false]

    return (
        (showActions ?
                <ListView
                    admin={true}
                    headers={headers}
                    get={'submissions'}
                    get_id={project_id}
                    sortable={sortable}
                    action_name={'download_submission'}
                    page_size={page_size}
                />
                :
                <ListView
                    admin={true}
                    headers={headers}
                    get={'submissions'}
                    get_id={project_id}
                    sortable={sortable}
                    page_size={page_size}
                />
        )
    )
}

export default ProjectSubmissionsList;