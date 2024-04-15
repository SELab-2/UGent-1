import getTranslations from "../../translations";
import {render} from "@testing-library/react";
import Groups from "@app/[locale]/project/[project_id]/edit/groups";
import React from "react";

describe('Groups', () => {
    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en} = render(
            <Groups
                groupAmount={1}
                isGroupAmountEmpty={false}
                groupSize={1}
                isGroupSizeEmpty={false}
                setGroupAmount={jest.fn()}
                setGroupSize={jest.fn()}
                translations={translations.en}
            />
        );

        // check that it was rendered properly
        expect(getByText_en('Amount of groups')).toBeInTheDocument();
        expect(getByText_en('Group size')).toBeInTheDocument();

        const {getByText: getByText_nl} = render(
            <Groups
                groupAmount={1}
                isGroupAmountEmpty={false}
                groupSize={1}
                isGroupSizeEmpty={false}
                setGroupAmount={jest.fn()}
                setGroupSize={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Aantal groepen')).toBeInTheDocument();
        expect(getByText_nl('Groepsgrootte')).toBeInTheDocument();
    });
});