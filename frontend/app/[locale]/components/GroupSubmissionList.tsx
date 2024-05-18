"use client"

import ListView from "@app/[locale]/components/ListView";
import React from "react";
import {useTranslation} from "react-i18next";

const GroupSubmissionList = ({project_id, page_size = 5, search}: {
    project_id: number,
    page_size: number,
    search: string
}) => {
    const {t} = useTranslation()
    const headers = [t("group_number"), t("submission_date"), t("Status"), ""]
    const headers_backend = ["group_nr", "submission_date", "status", ""]
    const sortable = [true, true, false]

    return (
        <ListView
            admin={true}
            headers={headers}
            get={'submissions_group'}
            get_id={project_id}
            sortable={sortable}
            action_name={'download_submission'}
            page_size={page_size}
            headers_backend={headers_backend}
            search_text={search}
        />

    )
}

export default GroupSubmissionList;