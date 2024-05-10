import getTranslations from "../../translations";
import {render, screen} from "@testing-library/react";
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
        expect(screen.getByText('required_files')).toBeInTheDocument();
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();

    });
});