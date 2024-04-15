import {fireEvent, render} from "@testing-library/react";
import React from "react";
import RemoveDialog from "@app/[locale]/project/[project_id]/edit/removedialog";
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
        expect(getByText_en('Remove project?')).toBeInTheDocument();
        expect(getByText_en('This action cannot be undone.')).toBeInTheDocument();
        expect(getByText_en('Remove')).toBeInTheDocument();
        expect(getByText_en('Cancel')).toBeInTheDocument();

        const {getByText: getByText_nl} = render(
            <RemoveDialog
                confirmRemove={true}
                handle_remove={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.nl}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Project verwijderen?')).toBeInTheDocument();
        expect(getByText_nl('Deze actie kan niet ongedaan worden gemaakt.')).toBeInTheDocument();
        expect(getByText_nl('Verwijderen')).toBeInTheDocument();
        expect(getByText_nl('Annuleren')).toBeInTheDocument();
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

        const button = getByText('Cancel');
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

        const button = getByText('Remove');
        fireEvent.click(button);

        expect(handle_remove).toHaveBeenCalled();
    });
});