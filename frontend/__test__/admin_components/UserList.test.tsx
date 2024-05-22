import { render, screen } from "@testing-library/react";
import React from "react";
import UserList from "@app/[locale]/components/admin_components/UserList";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key
  }),
}));

describe("UserList", () => {
  it("renders with translated headers, BackButton text, and ListView props", async () => {
    render(<UserList />);

    // BackButton
    const backButton = screen.getByRole("button", { name: /back to home page/i }); // Match translated button text partially

    expect(backButton).toBeInTheDocument();

    // ListView headers
    const emailHeader = screen.getByText(/email/i); // Match translated email partially
    const roleHeader = screen.getByText(/role/i); // Match translated role partially

    expect(emailHeader).toBeInTheDocument();
    expect(roleHeader).toBeInTheDocument();

  });
});
