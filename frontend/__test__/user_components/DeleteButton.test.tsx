import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import DeleteButton from "@app/[locale]/components/user_components/DeleteButton";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key
    }),
}));


jest.mock("../../lib/api", () => ({
    deleteUser: jest.fn(() => Promise.resolve()),
}));

describe("DeleteButton", () => {
    it("render and delete", async () => {
        render(<DeleteButton userId={1}/>);

        const deleteButton = screen.getByRole("button", {name: /delete user/i});
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        const dialogTitle = screen.getByText("Are you sure you want to delete this user?");
        const cancelButton = screen.getByRole("button", {name: /cancel/i});
        const deleteButtonInDialog = screen.getByRole("button", {name: /delete/i});

        fireEvent.click(cancelButton);

        fireEvent.click(deleteButton);
        fireEvent.click(deleteButtonInDialog);
    });
});
