import {studentUsername, studentPassword} from '../../fixtures/login.json';
import 'cypress-file-upload';

describe('student project page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
    });

    it ('add a submission to a project', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('en').click();
        cy.contains('nl').click();
        cy.contains('View').click();

        cy.contains('Indiening toevoegen').click();
        cy.url().should('eq', 'http://localhost:3000/nl/project/2/submit');

        cy.contains('submit');
        cy.contains('Project inleveren: AI project')
        cy.contains('Bestanden');

        cy.contains('submit').click();
        cy.contains('Fout bij inleveren, probeer het opnieuw');

        cy.get('#filepicker').click();
        cy.fixture('submission.txt').then(fileContent => {
          cy.get('input[type="file"]').attachFile({
            fileContent: undefined,
            fileName: 'submission.txt',
            mimeType: 'text/plain'
          });
        });


    });


});