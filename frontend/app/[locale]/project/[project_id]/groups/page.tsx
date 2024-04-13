'use client';
import NavBar from "@app/[locale]/components/NavBar";
import ListView from "@app/[locale]/components/ListView";
import React, {useEffect, useState} from "react";
import {getGroups, Group} from "@lib/api";

const ProjectGroupsPage = ({params: {locale, course_id, project_id}}: {
    params: { locale: any, course_id: number, project_id: number }
}) => {

    const [groups, setGroups] = useState<Group[] | null>(null);

    useEffect(() => {
        const fetchProjectGroups = async () => {
            try {
                const allGroups: Group[] = await getGroups();
                let groups: Group[] = [];
                for (let group of allGroups) {
                    if (group.project_id === project_id) {
                        groups.push(group);
                    }
                }
                setGroups(groups);

            } catch (error) {
                alert("Error fetching project: " + error)
            }
        }

        fetchProjectGroups()
    }, [project_id])

    const headers = ["Group number", "users"]

    const values = groups.map((group) => [
        group.nr,
        group.users ? group.users.length : 0
    ]);
    return (
        <div>
            <NavBar/>
            <h1>ProjectGroups page</h1>
            <ListView
                headers={headers}
                values={[values]}
                action_name={"View group members"}
            />
        </div>
    )
}

export default ProjectGroupsPage