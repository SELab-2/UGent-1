import {teacherUsername, teacherPassword, teacherEmail} from '../../fixtures/login.json';

describe('teacher profile page', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
        cy.visit('http://localhost:3000/en/profile' );
    });

    it('check all fields', () => {
        cy.contains(teacherEmail);
        cy.contains('Role: Teacher');
        cy.contains('Edit Account')
    });

    it('edit account and cancel', () => {
        cy.contains('Edit Account').click();

        cy.contains(teacherEmail);
        cy.contains('Role: Teacher');
        cy.contains('Save');
        cy.url().should('eq', 'http://localhost:3000/en/profile/edit');

        cy.contains('Cancel').click();
        cy.url().should('eq', 'http://localhost:3000/en/profile');
    });
});