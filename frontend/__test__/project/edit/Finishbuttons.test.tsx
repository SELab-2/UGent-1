import {fireEvent, render} from "@testing-library/react";
import React from "react";
import FinishButtons from "@app/[locale]/project/[project_id]/edit/finishbuttons";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Finishbuttons', () => {

    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByText_en, getByTestId} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.en}
                course_id={1}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        // check that the buttons were rendered properly
        expect(getByTestId('AlarmOnIcon')).toBeInTheDocument();
        expect(getByTestId('VisibilityIcon')).toBeInTheDocument();
        expect(getByText_en('Save')).toBeInTheDocument();
        expect(getByText_en('Cancel')).toBeInTheDocument();
        expect(getByText_en('Remove')).toBeInTheDocument();


        const {getByText: getByText_nl} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.nl}
                course_id={1}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        // check if text gets translated to dutch
        expect(getByText_nl('Opslaan')).toBeInTheDocument();
        expect(getByText_nl('Annuleren')).toBeInTheDocument();
        expect(getByText_nl('Verwijderen')).toBeInTheDocument();
    });

    it('Cancels', async () => {
        const translations = await getTranslations();
        const courseId = 1;

        delete window.location;
        window.location = { href: '' } as any;

        const {getByText} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.en}
                course_id={courseId}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        const button = getByText('Cancel');
        fireEvent.click(button);

        expect(window.location.href).toBe("/course/" + courseId + "/");
    });

    it('Saves', async () => {
        const translations = await getTranslations();
        const handleSave = jest.fn();
        const {getByText} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={handleSave}
                setConfirmRemove={jest.fn()}
                translations={translations.en}
                course_id={1}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        const button = getByText('Save');
        fireEvent.click(button);

        expect(handleSave).toHaveBeenCalled();
    });

    it("Removes", async () => {
        const translations = await getTranslations();

        const setConfirmRemove = jest.fn();
        const {getByText} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={jest.fn()}
                setConfirmRemove={setConfirmRemove}
                translations={translations.en}
                course_id={1}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        const button = getByText('Remove');
        fireEvent.click(button);

        expect(setConfirmRemove).toHaveBeenCalled();

    });
});