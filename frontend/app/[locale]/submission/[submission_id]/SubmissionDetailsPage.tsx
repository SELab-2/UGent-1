import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getSubmission, Submission} from "@lib/api";


const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

interface ProjectDetailsPageProps {
    locale: any;
    submission_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({locale, submission_id}) => {
    const {t} = useTranslation();

    const [submission, setSubmission] = useState<Submission>();
    const [loadingSubmission, setLoadingSubmission] = useState<boolean>(true);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setSubmission(await getSubmission(submission_id));
            } catch (error) {
                console.error("There was an error fetching the submission data:", error);
            }
        }

        fetchSubmission().then(() => setLoadingSubmission(false));
    })

    return (
        (loadingSubmission && (
            <div/>
        ))
    )
}

export default ProjectDetailsPage;