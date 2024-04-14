import NavBar from "@app/[locale]/components/NavBar";
import initTranslations from "@app/i18n";
import {APIError, getProject, getProjectSubmissions, Project, Submission} from "@lib/api";
import React from "react";
import ListView from "@app/[locale]/components/ListView";

const SubmissionsPage = ({params: {locale, course_id, project_id}}: {
    params: { locale: any, course_id: number, project_id: number }
}) => {
    const [translations, setTranslations] = React.useState({t: (key: any) => key});
    const [error, setError] = React.useState<APIError | null>(null);
    const [project, setProject] = React.useState<Project | null>();
    const [submissions, setSubmissions] = React.useState<Submission[] | null>(null);

    React.useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    React.useEffect(() => {
        const fetchProject = async () => {
            try {
                setProject(await getProject(project_id));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchProject();
    }, [project_id]);

    React.useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setSubmissions(await getProjectSubmissions(project_id));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        }

        fetchSubmissions()
    }, [project_id])

    const handleReturn = () => {
        window.location.href = `home/course/${course_id}/project/${project_id}`
    }

    const headers = ["Group number", "Submission date", "Status"]

    return (
        <div>
            <NavBar/>
            <button
                onClick={handleReturn}
            />
            <ListView
                headers={headers}
                values={(course_id && project_id && submissions) ? submissions.map((submission) => [
                    submission.group_id,
                    submission.timestamp,
                    // TODO: allow for boolean to icon conversion in ListView
                    submission.output_test !== undefined
                ]) : []}
                action_name={"Download selected submissions"}
            />
        </div>
    )
}

export default SubmissionsPage