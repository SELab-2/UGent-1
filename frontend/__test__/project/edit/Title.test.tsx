import {render, screen} from "@testing-library/react";
import React from "react";
import Title from "@app/[locale]/components/project_components/title";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Title', () => {
    it('renders correctly', async () => {

        const {getByText: getByRole} = render(
            <Title
                isTitleEmpty={false}
                setTitle={jest.fn()}
                title="Test title"
                score={50}
                isScoreEmpty={false}
                setScore={jest.fn()}
            />
        );

        // check that the title and score were rendered properly
        expect(screen.getByLabelText('title')).toBeInTheDocument();
        expect(screen.getByText('max_score')).toBeInTheDocument();

    });
});