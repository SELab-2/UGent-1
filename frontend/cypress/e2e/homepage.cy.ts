import { username, password, email } from '../fixtures/login.json';

describe('go to home page', () => {
    it('should log in successfully', () => {
        cy.visit('http://localhost:3000/')
        cy.login(username, password);
    });
});