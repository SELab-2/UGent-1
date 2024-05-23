import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Groups from '@app/[locale]/components/project_components/groups';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Groups', () => {
    let setGroupAmount: jest.Mock;
    let setGroupSize: jest.Mock;

    beforeEach(() => {
        setGroupAmount = jest.fn();
        setGroupSize = jest.fn();
    });

    const renderComponent = (props: any) => {
        return render(
            <Groups {...props} />
        );
    };

    it('renders component correctly', () => {
        renderComponent({
            groupAmount: 5,
            isGroupAmountEmpty: false,
            groupSize: 3,
            isGroupSizeEmpty: false,
            setGroupAmount,
            setGroupSize,
        });

        expect(screen.getByText('groups')).toBeInTheDocument();
        expect(screen.getByText('group_amount')).toBeInTheDocument();
        expect(screen.getByText('group_size')).toBeInTheDocument();
    });

    it('displays error for empty group amount', () => {
        renderComponent({
            groupAmount: '',
            isGroupAmountEmpty: true,
            groupSize: 3,
            isGroupSizeEmpty: false,
            setGroupAmount,
            setGroupSize,
        });

        expect(screen.getByText('group_amount_required')).toBeInTheDocument();
    });

    it('displays error for empty group size', () => {
        renderComponent({
            groupAmount: 5,
            isGroupAmountEmpty: false,
            groupSize: '',
            isGroupSizeEmpty: true,
            setGroupAmount,
            setGroupSize,
        });

        expect(screen.getByText('group_size_required')).toBeInTheDocument();
    });
});
