import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import RemoveDialog from "@app/[locale]/components/project_components/removedialog";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Removedialog', () => {

    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en, getByTestId} = render(
            <RemoveDialog
                confirmRemove={true}
                handle_remove={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.en}
            />
        );

        // check that the text was rendered properly
        expect(screen.getByText('remove_dialog')).toBeInTheDocument();
        expect(screen.getByText('action_dialog')).toBeInTheDocument();
        expect(screen.getByText('remove_confirm')).toBeInTheDocument();
        expect(screen.getByText('remove_cancel')).toBeInTheDocument();

    });

    it('Cancels', async () => {
        const translations = await getTranslations();
        const handle_remove = jest.fn();
        const setConfirmRemove = jest.fn();
        const {getByText} = render(
            <RemoveDialog
                confirmRemove={true}
                handle_remove={handle_remove}
                setConfirmRemove={setConfirmRemove}
                translations={translations.en}
            />
        );

        const button = screen.getByText('remove_cancel');
        fireEvent.click(button);

        expect(setConfirmRemove).toHaveBeenCalled();
    });

    it("Removes", async () => {
        const translations = await getTranslations();

        const handle_remove = jest.fn();
        const setConfirmRemove = jest.fn();
        const {getByText} = render(
            <RemoveDialog
                confirmRemove={true}
                handle_remove={handle_remove}
                setConfirmRemove={setConfirmRemove}
                translations={translations.en}
            />
        );

        const button = screen.getByText('remove_confirm');
        fireEvent.click(button);

        expect(handle_remove).toHaveBeenCalled();
    });
});