import {render, screen} from "@testing-library/react";
import React from "react";
import Conditions from "@app/[locale]/components/project_components/conditions";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Conditions', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();

        const {getByText: getByText_en, getByDisplayValue, queryAllByRole} = render(
            <Conditions
                conditions={['First', 'Second']}
                setConditions={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the conditions were rendered properly
        expect(screen.getByText('conditions')).toBeInTheDocument();
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();

        // check that the text field was rendered properly
        const textField = queryAllByRole('textbox');
        expect(textField.length).toBe(1);
    });
});