import {studentUsername, studentPassword} from '../../fixtures/login.json';
import 'cypress-file-upload';

describe('student project page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
    });

    it ('add a submission to a project', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('English').click();
        cy.contains('Nederlands').click();
        cy.contains('View').click();

        cy.contains('Indiening toevoegen').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2/submit');

        cy.contains('submit');
        cy.contains('AI project')
        cy.contains('Upload een map');
        cy.contains('Upload bestanden');

        cy.contains('submit').should('be.disabled');


    });


});