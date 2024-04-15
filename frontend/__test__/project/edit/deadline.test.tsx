import {render} from "@testing-library/react";
import React from "react";
import Deadline from "@app/[locale]/project/[project_id]/edit/deadline";
import dayjs from "dayjs";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Deadline', () => {
    it('renders correctly', async () => {
        const currentDate = dayjs();
        const dateString = currentDate.format('MMMM YYYY');

        const {getByText} = render(
            <Deadline
                deadline={currentDate}
                setDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        // check that the deadline was rendered properly
        expect(getByText(dateString)).toBeInTheDocument();
    });
});