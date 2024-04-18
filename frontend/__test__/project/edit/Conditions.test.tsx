import {render} from "@testing-library/react";
import React from "react";
import Condtions from "@app/[locale]/components/project_components/conditions";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Conditions', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();

        const {getByText: getByText_en, getByDisplayValue, queryAllByRole} = render(
            <Condtions
                conditions={['First', 'Second']}
                setConditions={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the conditions were rendered properly
        expect(getByText_en('Conditions')).toBeInTheDocument();
        expect(getByDisplayValue('First')).toBeInTheDocument();
        expect(getByDisplayValue('Second')).toBeInTheDocument();

        // check that the text field was rendered properly
        const textField = queryAllByRole('textbox');
        expect(textField.length).toBe(2);


        const {getByText: getByText_nl} = render(
            <Condtions
                conditions={['First', 'Second']}
                setConditions={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Voorwaarden')).toBeInTheDocument();
    });
});