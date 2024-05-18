import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";
import FinishButtons from "@app/[locale]/components/project_components/finishbuttons";
import getTranslations from "../../translations";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})
}));

describe('Finishbuttons', () => {

    it('renders correctly', async () => {
        const translations = await getTranslations();
        const {getByText: getByTestId} = render(
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
        expect(screen.getByTestId('AlarmOnIcon')).toBeInTheDocument();
        expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('remove')).toBeInTheDocument();

    });

    it('Cancels', async () => {
        const translations = await getTranslations();
        const projectId = 1;

        delete window.location;
        window.location = {href: ''} as any;

        const {getByText} = render(
            <FinishButtons
                visible={true}
                setVisible={jest.fn()}
                handleSave={jest.fn()}
                setConfirmRemove={jest.fn()}
                translations={translations.en}
                project_id={projectId}
                setHasDeadline={jest.fn()}
                hasDeadline={true}
            />
        );

        const button = screen.getByText('cancel');
        fireEvent.click(button);

        expect(window.location.href).toBe("/project/" + projectId + "/");
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

        const button = screen.getByText('save');
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

        const button = screen.getByText('remove');
        fireEvent.click(button);

        expect(setConfirmRemove).toHaveBeenCalled();

    });
});