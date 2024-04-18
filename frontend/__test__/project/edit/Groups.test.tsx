import getTranslations from "../../translations";
import {render, screen} from "@testing-library/react";
import Groups from "@app/[locale]/components/project_components/groups";
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
        expect(screen.getByText('Amount of groups')).toBeInTheDocument();
        expect(screen.getByText('Group size')).toBeInTheDocument();

    });
});