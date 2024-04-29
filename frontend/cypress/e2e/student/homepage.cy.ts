import { username, password } from '../../fixtures/login.json';

describe('go to home page as student', () => {
    beforeEach(() => {
        cy.login(username, password);
    });

    it('go to home page, check everything', () => {
        cy.login(username, password);

        cy.contains('Pigeonhole');

        cy.contains('Filter Courses');
        cy.contains('View Archive');
        cy.contains('View All Courses');
        cy.contains('en');

    });

    it('go to view all courses in home page', () => {
        cy.contains('View All Courses').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/all');
    });

    it('change language on home page', () => {
        // select language selector
        cy.contains('en').click();
        // change language
        cy.contains('nl').click();

        cy.contains('Filter Cursussen');
        cy.contains('Bekijk Archief');
        cy.contains('Bekijk Alle Cursussen');
        cy.contains('nl');

    });
});