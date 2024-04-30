import {username, password, email} from '../../fixtures/login.json';

describe('profile page', () => {
    beforeEach(() => {
        cy.login(username, password);
        cy.visit('http://localhost:3000/en/profile', {timeout: 2000});
    });

    it('check all fields', () => {
        cy.contains(email);
        cy.contains('Role: Student');
        cy.contains('Edit Account')
    });

    it('edit account and cancel', () => {
        cy.contains('Edit Account').click();

        cy.contains(email);
        cy.contains('Role: Student');
        cy.contains('Save');
        cy.url().should('eq', 'http://localhost:3000/en/profile/edit');

        cy.contains('Cancel').click();
        cy.url().should('eq', 'http://localhost:3000/en/profile');
    });
});