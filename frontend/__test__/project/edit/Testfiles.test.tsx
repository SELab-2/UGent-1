import getTranslations from "../../translations";
import {fireEvent, render, screen} from "@testing-library/react";
import TestFiles from "@app/[locale]/components/project_components/testfiles";
import React from "react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Testfiles', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();
        render(
            <TestFiles
                testfilesName={["First", "Second"]}
                setTestfilesName={jest.fn()}
                testfilesData={[]}
                setTestfilesData={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the buttons were rendered properly
        expect(screen.getByText('test_files')).toBeInTheDocument();
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
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