import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import AddButton from "@app/[locale]/components/AddButton";

describe("AddButton", () => {
    it("render", async () => {
        render(<AddButton translationkey={"key"} href={"/home"}/>);
        const backButton = screen.getByText(/key/i);
        fireEvent.click(backButton);
    });
});
