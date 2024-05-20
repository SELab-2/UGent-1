import {studentUsername, studentPassword, studentEmail} from '../../fixtures/login.json';

describe('profile page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
    });
    it('should login', () => {
        cy.url().should('eq', 'http://localhost:3000/en/home')

    });
});