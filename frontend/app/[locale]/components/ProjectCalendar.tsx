'use client';

import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/router';
import {getCoursesForUser, getProjectsFromCourse} from "@lib/api";

interface Data {
  id: number;
  name: string;
  deadline: string; // ISO date string
}
const ProjectCalendar = async () =>  {
  const router = useRouter();
  const [value, setValue] = useState(new Date());
    const [projects, setProjects] = useState<Data[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const courses = await getCoursesForUser()
      const temp_projects: Data[] = [];
      for (const course of courses) {
        const course_projects = await getProjectsFromCourse(course.course_id)
        for (const project of course_projects) {
          temp_projects.push({
            id: project.project_id,
            name: project.name,
            deadline: project.deadline,
          });
        }
      }
      setProjects(temp_projects);
    };
    fetchProjects();
  }, []);


  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateClick = (date: Date) => {
    const project = projects.find(project =>
      isSameDay(new Date(project.deadline), date)
    );
    if (project) {
      router.push(`/projects/${project.id}`);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const project = projects.find(project =>
        isSameDay(new Date(project.deadline), date)
      );
      return project ? (
        <div className="highlight">{project.name}</div>
      ) : null;
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        onClickDay={handleDateClick}
        tileContent={tileContent}
      />
      <style jsx>{`
        .highlight {
          background-color: yellow;
        }
      `}</style>
    </div>
  );
};

export default ProjectCalendar;
