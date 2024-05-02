import { teacherUsername, teacherPassword } from '../../fixtures/login.json';

// TODO change these correctly for teacher account
describe('go to home page as teacher', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
    });

    it('go to home page, check everything', () => {
        cy.contains('Pigeonhole');

        cy.contains('Filter Courses');
        cy.contains('View Archive');
        cy.contains('View All Courses');
        cy.contains('Create Course');

    });

    it('go to view all courses in home page', () => {
        cy.contains('View All Courses').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/all');
    });

});