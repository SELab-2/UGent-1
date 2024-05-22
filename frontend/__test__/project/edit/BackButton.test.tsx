import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import BackButton from "@app/[locale]/components/project_components/BackButton";

describe("BackButton", () => {
    it("render", async () => {
        render(<BackButton text={"back"} destination={"/home"}/>);
        const backButton = screen.getByRole("button", {name: /back/i});
        fireEvent.click(backButton);
    });
});
