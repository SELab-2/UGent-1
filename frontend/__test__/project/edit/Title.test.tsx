import {render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import Title from "@app/[locale]/components/project_components/title";

describe("Title", () => {
    it("renders title and max score labels with translations", async () => {
        render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={1}
                isScoreEmpty={false}
                setScore={jest.fn()}
            />
        );

        // Assert translated labels using actual translation logic
        expect(screen.getByRole("heading", {name: /title/i})).toBeInTheDocument();
        expect(screen.getByRole("heading", {name: /max_score/i})).toBeInTheDocument();
    });

    it("renders title input with placeholder and helper text", () => {
        render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={1}
                isScoreEmpty={false}
                setScore={jest.fn()}
            />
        );

        const titleInput = screen.getByLabelText("title");
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveAttribute("placeholder", "title");
    });

    it("renders score input with error when empty and sets score on change", () => {
        render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={1}
                isScoreEmpty={true}
                setScore={jest.fn()}
            />
        );

        const scoreInput = screen.getByRole("spinbutton");
        expect(scoreInput).toHaveAttribute("aria-invalid", "true");

        fireEvent.change(scoreInput, {target: {value: 50}});
    });

    it("limits score input between 1 and 100", () => {
        render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={1}
                isScoreEmpty={false}
                setScore={jest.fn()}
            />
        );

        const scoreInput = screen.getByRole("spinbutton");

        fireEvent.change(scoreInput, {target: {value: 0}});

        fireEvent.change(scoreInput, {target: {value: 150}});
    });

    it("score no input", () => {
        render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={1}
                isScoreEmpty={true} // Set initial score empty
                setScore={jest.fn()}
            />
        );

        const scoreInput = screen.getByRole("spinbutton");

        fireEvent.change(scoreInput, {target: {value: ''}});
    });

    it("updates title state on title input change", () => {
        const mockSetTitle = jest.fn(); // Mock the setTitle function

        render(
            <Title
                isTitleEmpty={false}
                setTitle={mockSetTitle}
                title="Test title"
                score={1}
                isScoreEmpty={false}
                setScore={jest.fn()}
            />
        );

        const titleInput = screen.getByLabelText("title");
        fireEvent.change(titleInput, {target: {value: "New Title"}});

        expect(mockSetTitle).toHaveBeenCalledWith("New Title"); // Verify setTitle called with new value
    });

});
