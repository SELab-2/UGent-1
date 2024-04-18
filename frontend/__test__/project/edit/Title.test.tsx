import {render} from "@testing-library/react";
import React from "react";
import Title from "@app/[locale]/components/project_components/title";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Title', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();

        const {getByText: getByText_en, getByRole} = render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={50}
                isScoreEmpty={false}
                setScore={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the title and score were rendered properly
        expect(getByText_en('Title')).toBeInTheDocument();
        expect(getByText_en('Maximal score')).toBeInTheDocument();

        // check that the text field was rendered properly for numbers
        const numberField = getByRole('spinbutton');
        expect(numberField).toBeInTheDocument();
        expect(numberField).toHaveValue(50);

        // check that the text field was rendered properly
        const textField = getByRole('textbox');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveValue('Test title');

        const {getByText: getByText_nl} = render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={50}
                isScoreEmpty={false}
                setScore={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Titel')).toBeInTheDocument();
        expect(getByText_nl('Maximale score')).toBeInTheDocument();
    });
});