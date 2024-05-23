import {render} from "@testing-library/react";
import React from "react";
import RequiredFilesList from "@app/[locale]/components/general/RequiredFilesList";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key
    }),
}));


describe("RequiredFilesList", () => {

    it("renders correctly", async () => {
        const mockSetItems = jest.fn();
        render(<RequiredFilesList items={['test']}
                                  setItems={mockSetItems}
                                  empty_list_placeholder={"Test"}
                                  input_placeholder={"Input"}
                                  button_text={"Button"}
                                  items_status={["+", "-"]}
                                  setItemsStatus={jest.fn()}
        />);
    });
});
