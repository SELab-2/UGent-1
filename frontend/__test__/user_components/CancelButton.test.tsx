import {render, screen} from "@testing-library/react";
import React from "react";
import CancelButton from "@app/[locale]/components/user_components/CancelButton";

describe("CancelButton", () => {
    it("renders cancel button and click", async () => {
        render(<CancelButton/>);
        screen.getByText(/cancel/i).click();
    });
});
