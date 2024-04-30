import {username, password} from '../../fixtures/login.json';

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

    it('test logout', () => {
        // click the name top right in page
        cy.get('button[aria-label="Account settings"]').click();

        cy.contains('Settings');
        cy.contains('My Profile');
        cy.contains('Log out').click();

        cy.url().should('eq', 'http://localhost:3000/en')
    });


    it('test going to profile', () => {
        // click the name top right in page
        cy.get('button[aria-label="Account settings"]').click();

        cy.contains('Log out');
        cy.contains('Settings');
        cy.contains('My Profile').click();

        cy.url().should('eq', 'http://localhost:3000/en/profile')
    });

    it('test menu course', () => {
        cy.get('button[aria-label="menu"]').click();

        cy.contains('Manual');
        cy.contains('GitHub');
        cy.contains('My Profile');
        cy.contains('Log out');
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/5')
    });


    it('test menu logout', () => {
        cy.get('button[aria-label="menu"]').click();

        cy.contains('Manual');
        cy.contains('GitHub');
        cy.contains('My Profile');
        cy.contains('Log out').click();

        cy.url().should('eq', 'http://localhost:3000/en')
    });

     it('test menu profile', () => {
        cy.get('button[aria-label="menu"]').click();

        cy.contains('Manual');
        cy.contains('GitHub');
        cy.contains('Log out');
        cy.contains('My Profile').click();

        cy.url().should('eq', 'http://localhost:3000/en/profile')
    });

     it('test menu github', () => {
        cy.get('button[aria-label="menu"]').click();

        cy.contains('My Profile');
        cy.contains('Manual');
        cy.contains('Log out');
        cy.contains('GitHub').click();

        cy.url().should('eq', 'https://github.com/SELab-2/UGent-1')
    });

});