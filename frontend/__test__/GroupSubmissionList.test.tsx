import {render} from "@testing-library/react";
import React from "react";
import GroupSubmissionList from "@app/[locale]/components/GroupSubmissionList";


jest.mock("../app/[locale]/components/ListView", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ListView</div>), // Mock rendering
}));

describe("CourseDetails", () => {
    it("render CourseDetails", async () => {
        render(<GroupSubmissionList page_size={5} project_id={1} search={"test"}/>);
    });
});
