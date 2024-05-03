import { teacherUsername, teacherPassword } from '../../fixtures/login.json';

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

    it('create course page', () => {
        cy.contains('Create Course').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/add');
    });
});