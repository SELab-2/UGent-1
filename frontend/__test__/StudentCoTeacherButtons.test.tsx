import React from 'react';
import { render, screen } from '@testing-library/react';
import StudentCoTeacherButtons from '@app/[locale]/components/StudentCoTeacherButtons';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            if (key === "view_students") return "View Students";
            if (key === "view_co_teachers") return "View Co-Teachers";
            return key;
        }
    }),
}));

describe('StudentCoTeacherButtons', () => {
    it('renders links with correct texts and URLs', () => {
        const course_id = 123; // Example course ID

        render(<StudentCoTeacherButtons course_id={course_id} />);

        // Assert that the links have the correct text
        const studentsLink = screen.getByRole('link', { name: /view students/i });
        const coTeachersLink = screen.getByRole('link', { name: /view co-teachers/i });

        // Assert that the links have the correct URLs
        expect(studentsLink).toHaveAttribute('href', `/course/${course_id}/students`);
        expect(coTeachersLink).toHaveAttribute('href', `/course/${course_id}/co_teachers`);

        // Optionally check styles
        expect(studentsLink).toHaveStyle({ width: 'fit-content' });
        expect(coTeachersLink).toHaveStyle({ width: 'fit-content' });
    });
});
