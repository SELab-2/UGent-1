import {render, screen} from "@testing-library/react";
import React from "react";
import CourseControls from "@app/[locale]/components/CourseControls";
import {APIError, fetchUserData, UserData} from "@lib/api";

jest.mock('../lib/api', () => ({
    fetchUserData: jest.fn(),
}));
describe("CourseControls", () => {
    it("render coursecontrols", async () => {
        const mockOnYearChange = jest.fn();
        render(<CourseControls selectedYear={2024} onYearChange={mockOnYearChange}/>);

        expect(screen.getByText(/all_courses/i)).toBeInTheDocument();

        expect(screen.getByText(/create_course/i)).toBeInTheDocument();

        expect(screen.getByText(/view_archive/i)).toBeInTheDocument();

    });
});
