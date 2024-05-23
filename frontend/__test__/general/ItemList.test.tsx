import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import ItemList from "@app/[locale]/components/general/ItemsList";

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



describe("ItemList", () => {

    it("renders correctly", async () => {
        const mockSetItems = jest.fn();
        render(<ItemList items={['test']}
                         setItems={mockSetItems}
                         empty_list_placeholder={"Test"}
                         input_placeholder={"Input"}
                         button_text={"Button"}/>);
    });
});
