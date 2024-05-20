'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useProjects } from '../calendar/useProjects';

const ProjectCalendar: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleProjectClick = (projectId: string) => {
    window.location.href = `/project/${projectId}`;
  };

  const handleDateClick = (date: Date) => {
    const projectsOnThisDay = projects.filter(project =>
      isSameDay(new Date(project.deadline), date)
    );
    if (projectsOnThisDay.length === 1) {
      window.location.href = `/project/${projectsOnThisDay[0].id}`;
    }
    // You may handle the case of multiple projects differently, such as showing a modal or a list of projects.
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const projectsOnThisDay = projects.filter(project =>
        isSameDay(new Date(project.deadline), date)
      );
      return projectsOnThisDay.length > 0 ? (
        <div className="highlight">
          {projectsOnThisDay.map((project, index) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="project-link"
            >
              {project.name}
              {index !== projectsOnThisDay.length - 1 && <hr />}
            </div>
          ))}
        </div>
      ) : null;
    }
    return null;
  };

  return (
    <div className="calendar-container">
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
        .calendar-container {
          max-width: 1000px; /* Adjust the width as needed */
          margin: 0 auto;
        }
        .react-calendar {
          width: 100%;
        }
        .react-calendar__tile {
          height: 100px; /* Increase the height of each tile */
        }
        .project-link {
          cursor: pointer;
          margin-bottom: 5px;
        }
        .project-link:hover {
          text-decoration: underline;
        }
        hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default ProjectCalendar;
