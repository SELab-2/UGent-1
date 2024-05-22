import {render, screen} from "@testing-library/react";
import React from "react";
import CancelButton from "@app/[locale]/components/course_components/CancelButton";

describe("UserList", () => {
    it("renders cancel button and click", async () => {
        render(<CancelButton/>);
        screen.getByText(/cancel/i).click();
    });
});
