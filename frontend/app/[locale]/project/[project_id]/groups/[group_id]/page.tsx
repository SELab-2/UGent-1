'use client';
import NavBar from "@app/[locale]/components/NavBar";
import ListView from "@app/[locale]/components/ListView";
import React, {useEffect, useState} from "react";
import {getGroup, Group} from "@lib/api";

const GroupPage = ({params: {locale, course_id, project_id, group_id}}: {
    params: { locale: any, course_id: number, project_id: number, group_id: number }
}) => {

    const [group, setGroup] = useState<Group | null>(null);

    useEffect(() => {
        const fetchProjectGroups = async () => {
            try {
                setGroup(await getGroup(group_id));
            } catch (error) {
                alert("Error fetching project: " + error)
            }
        }

        fetchProjectGroups()
    }, [project_id])

    const headers = ["First name", "Last name"]

    const values = group.users.map((user) => [
        user.first_name,
        user.last_name
    ]);
    return (
        <div>
            <NavBar/>
            <h1>Group page</h1>
            <ListView
                headers={headers}
                values={[values]}
            />
        </div>
    )
}

export default GroupPage