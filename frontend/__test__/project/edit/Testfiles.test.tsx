import getTranslations from "../../translations";
import {fireEvent, render} from "@testing-library/react";
import TestFiles from "@app/[locale]/project/[project_id]/edit/testfiles";
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Testfiles', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en, getByDisplayValue} = render(
            <TestFiles
                testfilesName={["First", "Second"]}
                setTestfilesName={jest.fn()}
                testfilesData={[]}
                setTestfilesData={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the buttons were rendered properly
        expect(getByText_en('Test files')).toBeInTheDocument();
        expect(getByText_en('First')).toBeInTheDocument();
        expect(getByText_en('Second')).toBeInTheDocument();

        const {getByText: getByText_nl} = render(
            <TestFiles
                testfilesName={[]}
                setTestfilesName={jest.fn()}
                testfilesData={[]}
                setTestfilesData={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Testbestanden')).toBeInTheDocument();
    });

    it('Delete', async () => {
        const translations = await getTranslations();
        const setTestfilesName = jest.fn();

        const {getByTestId} = render(
            <TestFiles
                testfilesName={["First"]}
                setTestfilesName={setTestfilesName}
                testfilesData={[]}
                setTestfilesData={jest.fn()}
                translations={translations.en}
            />
        );

        const button = getByTestId('DeleteIcon');
        fireEvent.click(button);

        expect(setTestfilesName).toHaveBeenCalled();
    });
});