import {render, fireEvent} from "@testing-library/react";
import React from "react";
import Assignment from "@app/[locale]/components/project_components/assignment";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Assignment', () => {
    it('renders correctly', async () => {
        const setDescription = jest.fn();
        const translations = await getTranslations();

        const {getByText: getByText_en, getByRole} = render(
            <Assignment
                isAssignmentEmpty={false}
                setDescription={setDescription}
                description="Test description"
                translations={translations.en}
            />
        );

        // check that the assignment was rendered properly
        expect(getByText_en('Assignment')).toBeInTheDocument();

        // check that the text field was rendered properly
        const textField = getByRole('textbox');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveValue('Test description');

        // simulate change event
        fireEvent.change(textField, {target: {value: 'New description'}});

        // check that setDescription was called with the new value
        expect(setDescription).toHaveBeenCalledWith('New description');
    });

    it('renders helper text when isAssignmentEmpty is true', async () => {
        const setDescription = jest.fn();
        const translations = await getTranslations();

        const {getByText} = render(
            <Assignment
                isAssignmentEmpty={true}
                setDescription={setDescription}
                description="Test description"
                translations={translations.en}
            />
        );

        // check that the helper text was rendered properly
        expect(getByText('Assignment is required')).toBeInTheDocument();
    });
});