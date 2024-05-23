import {render, screen} from "@testing-library/react";
import React from "react";
import CourseDetails from "@app/[locale]/components/CourseDetails";

// mock copyclipboardbutton component
jest.mock("../app/[locale]/components/CopyToClipboardButton", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked CopyToClipboardButton</div>), // Mock rendering
}));

jest.mock('../lib/api', () => ({
    getCourse: jest.fn(),
    Course: jest.fn(),
    UserData: jest.fn(),
    getUserData: jest.fn(),
}));
describe("CourseDetails", () => {
    it("render CourseDetails", async () => {
        render(<CourseDetails course_id={1}/>);

        expect(screen.getByText("no_description")).toBeInTheDocument();

        expect(screen.getByText("description")).toBeInTheDocument();

    });
});
