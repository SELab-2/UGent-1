import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import RequiredFiles from "@app/[locale]/components/project_components/requiredFiles";

// Mock translations with actual translation logic (consider using a mocking library)
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key
    }),
}));

describe("RequiredFiles", () => {
    it("renders required files title and list with translations", async () => {
        render(
            <RequiredFiles
                files={["First", "Second"]}
                setFiles={jest.fn()}
                file_status={["+", "-"]}
                setFileStatus={jest.fn()}
            />
        );

        const title = screen.getByText(/required_files/i);
        const fileList = screen.getByRole("list");

        expect(title).toBeInTheDocument();
        expect(fileList).toBeInTheDocument();

    });
});
