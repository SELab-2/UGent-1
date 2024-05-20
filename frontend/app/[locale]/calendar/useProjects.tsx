import { useState, useEffect } from 'react';
import { getCoursesForUser, getProjectsFromCourse } from '@lib/api';

interface Data {
  id: number;
  name: string;
  deadline: string; // ISO date string
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const courses = await getCoursesForUser();
        const temp_projects: Data[] = [];
        for (const course of courses) {
          const course_projects = await getProjectsFromCourse(course.course_id);
          for (const project of course_projects) {
            temp_projects.push({
              id: project.project_id,
              name: project.name,
              deadline: project.deadline,
            });
          }
        }
        setProjects(temp_projects);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
