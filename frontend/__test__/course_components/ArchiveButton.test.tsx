import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import ArchiveButton from "@app/[locale]/components/course_components/ArchiveButton";
import {APIError, archiveCourse} from "@lib/api";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key
    }),
}));

const mockCourse =
    {
        course_id: 1,
        name: "Course 1",
        description: "Description for Course 1",
        year: 2023,
        open_course: true,
        banner: null,
    };

jest.mock("../../lib/api", () => ({
    archiveCourse: jest.fn(),
}));


describe("ArchiveButton", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        archiveCourse.mockResolvedValueOnce(mockCourse.course_id);
    });

    it("renders correctly and click the button", async () => {
        render(<ArchiveButton course_id={1}/>);

        const archiveButton = screen.getByRole("button", {name: /archive course/i});

        expect(archiveButton).toBeInTheDocument();

        fireEvent.click(archiveButton);

        await expect(archiveCourse).toHaveBeenCalledWith(1);
    });

    it("api error", async () => {
        // for some reason mocking the apierror doesnt work?
        const mockAPIError = jest.fn();
        mockAPIError.mockImplementation(() => ({
            message: "API Error",
            status: 400,
            type: "UNKNOWN",
        }));

        archiveCourse.mockResolvedValueOnce(mockAPIError);

        render(<ArchiveButton course_id={1}/>);

        const archiveButton = screen.getByRole("button", {name: /archive course/i});

        fireEvent.click(archiveButton);

    });

});
