import {username, password} from '../../fixtures/login.json';

describe('student course page', () => {
    beforeEach(() => {
        cy.login(username, password);
    });

    it('go to course page ', () => {
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/5');

        cy.contains('Artificiële intelligentie');

        cy.contains('Description');
        cy.contains('new test description');

        cy.contains('Projects');
        cy.contains('View students');
    });

    it('view students in course page ', () => {
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/5');

        cy.contains('View students').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/5/students');
    });


    it('next and prev on students, and go back to course page ', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('View students').click();

        cy.contains('Next').click();
        cy.contains('Prev').click();

        cy.contains('Back to Course').click();
    });
});