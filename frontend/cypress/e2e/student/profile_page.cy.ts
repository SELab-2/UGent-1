import {studentUsername, studentPassword, studentEmail} from '../../fixtures/login.json';

describe('profile page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
        cy.visit('http://localhost:3000/en/profile' );
    });

    it('check all fields', () => {
        cy.contains(studentEmail);
        cy.contains('Role: Student');
        cy.contains('Edit Account')
    });

    it('edit account and cancel', () => {
        cy.contains('Edit Account').click();

        cy.contains(studentEmail);
        cy.contains('Role: Student');
        cy.contains('Save');
        cy.url().should('eq', 'http://localhost:3000/en/profile/edit');

        cy.contains('Cancel').click();
        cy.url().should('eq', 'http://localhost:3000/en/profile');
    });
});