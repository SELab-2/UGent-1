import {teacherUsername, teacherPassword, teacherEmail} from '../../fixtures/login.json';

describe('teacher course page', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/1');

    });

    it('go to course page ', () => {

        cy.contains('Artificiële intelligentie');

        cy.contains('Description');
        cy.contains('Kennisgebaseerd redeneren, machinaal leren, heuristische zoekstrategieën,' +
            ' neurale netwerken en deep learning, natuurlijke taalverwerking');


        cy.contains('Access');
        cy.contains('Open course');
        cy.contains('https://sel2-1.ugent.be/course/1?token=pzWjXxrowWKkXhFZvmrC')


        cy.contains('Projects');
        cy.contains('AI project')
        cy.contains('12/12/2021 13:12')

        cy.contains('Edit course');
        cy.contains('Add project');

        cy.contains('View students');
        cy.contains('View co-teachers');
    });

    it('copies to clipboard and view co-teachers', () => {
        const expectedCopiedText = 'https://sel2-1.ugent.be/course/1?token=pzWjXxrowWKkXhFZvmrC';

        cy.window().then((win) => {
            cy.stub(win.navigator.clipboard, 'writeText').withArgs(expectedCopiedText).returns(Promise.resolve());
        });

        // Trigger the copy action
        cy.get('[aria-label="Copy"]').click();

        // Check the copied text
        cy.window().then((win) => {
            expect(win.navigator.clipboard.writeText).to.have.been.calledWith(expectedCopiedText);
        });

        cy.contains('View co-teachers').click()

        cy.url().should('eq', 'http://localhost:3000/en/course/1/teachers');

        cy.contains(teacherEmail);

        cy.contains('Back to Course').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/1');
    });
});