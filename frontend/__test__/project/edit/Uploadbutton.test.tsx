import {fireEvent, render} from "@testing-library/react";
import React from "react";
import UploadTestFile from "@app/[locale]/components/project_components/uploadButton";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Uploadbutton', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en, getByDisplayValue} = render(
            <UploadTestFile
                testfilesName={[]}
                setTestfilesName={jest.fn()}
                testfilesData={[]}
                setTestfilesData={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the buttons were rendered properly
        expect(getByText_en('upload')).toBeInTheDocument();
    });
});