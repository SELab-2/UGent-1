import {render, screen} from "@testing-library/react";
import React from "react";
import CoursesGrid from "@app/[locale]/components/CoursesGrid";


jest.mock("../app/[locale]/components/CourseCard", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked CourseCard</div>), // Mock rendering
}));


jest.mock('../lib/api', () => ({
    getCoursesForUser: jest.fn(),
}));

describe("CourseDetails", () => {
    it("render CourseDetails", async () => {
        render(<CoursesGrid selectedYear={"2023-2024"}/>);
    });
});
