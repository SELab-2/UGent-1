import getTranslations from "../../translations";
import {render} from "@testing-library/react";
import RequiredFiles from "@app/[locale]/components/project_components/requiredFiles";
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Requiredfiles', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en, getByDisplayValue} = render(
            <RequiredFiles
                files={["First", "Second"]}
                setFiles={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the required files were rendered properly
        expect(getByText_en('Required files')).toBeInTheDocument();
        expect(getByDisplayValue('First')).toBeInTheDocument();
        expect(getByDisplayValue('Second')).toBeInTheDocument();


         const {getByText: getByText_nl} = render(
            <RequiredFiles
                files={["First", "Second"]}
                setFiles={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Verplichte bestanden')).toBeInTheDocument();
    });
});