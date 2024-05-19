import {studentUsername, studentPassword} from '../../fixtures/login.json';

describe('student project page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
    });


    it('go to project page ', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/1');

        //TODO this works because translations are not implemented yet
        cy.contains('en').click();
        cy.contains('nl').click();

        cy.contains('View').click();
        // cy.contains('en').click();
        // cy.contains('en').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2');

        cy.contains('AI project');
        cy.contains('12 december 2021 om 13:12');
        cy.contains('Groepen');
        cy.contains('Opdrachtomschrijving');
        cy.contains('Max score: 10');
    });

    it('view groups of project ', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('en').click();
        cy.contains('nl').click();
        cy.contains('View').click();

        cy.contains('Groepen').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2/groups');

        cy.contains('group_nr');
        cy.contains('Leden');
        cy.contains('alexander.vanoyen@sel2-1.ugent.be, axel.lorreyne@sel2-1.ugent.be');

        cy.contains('Terug naar Project pagina').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2');
    });

    it ('go to submission page from a project', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('en').click();
        cy.contains('nl').click();
        cy.contains('View').click();

        cy.contains('Indiening toevoegen').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2/submit');

        cy.contains('submit');
        cy.contains('Project inleveren: AI project')
        cy.contains('Bestanden');
    });
});