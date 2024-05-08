import getTranslations from "../../translations";
import {render, screen} from "@testing-library/react";
import Groups from "@app/[locale]/components/project_components/groups";
import React from "react";

describe('Groups', () => {
    it('renders correctly', async () => {
        const {getByText: getByText_en} = render(
            <Groups
                groupAmount={1}
                isGroupAmountEmpty={false}
                groupSize={1}
                isGroupSizeEmpty={false}
                setGroupAmount={jest.fn()}
                setGroupSize={jest.fn()}
            />
        );

        // check that it was rendered properly
        expect(screen.getByText('group_amount')).toBeInTheDocument();
        expect(screen.getByText('group_size')).toBeInTheDocument();

    });
});