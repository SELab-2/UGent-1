import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import DeleteButton from "@app/[locale]/components/course_components/DeleteButton";
import {deleteCourse} from "@lib/api";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key
    }),
}));


jest.mock("../../lib/api", () => ({
    deleteCourse: jest.fn(() => Promise.resolve()),
}));

describe("DeleteButton", () => {
    it("render and delete", async () => {
        render(<DeleteButton courseId={1}/>);

        const deleteButton = screen.getByRole("button", {name: /delete course/i});
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        const dialogTitle = screen.getByText("Are you sure you want to delete this course?");
        const cancelButton = screen.getByRole("button", {name: /cancel/i});
        const deleteButtonInDialog = screen.getByRole("button", {name: /delete/i});

        fireEvent.click(cancelButton);

        fireEvent.click(deleteButton);
        fireEvent.click(deleteButtonInDialog);
    });
});
