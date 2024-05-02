import {studentUsername, studentPassword} from '../../fixtures/login.json';

describe('join courses', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword)
        cy.visit('http://localhost:3000/en/course/all', {timeout: 2000});
    });

    it('back to homepage button', () => {
        cy.contains('Back to home page').click();
        cy.url().should('eq', 'http://localhost:3000/en/home');
    });

    it('next and previous page', () => {
        cy.contains('Next').click();
        cy.contains('Prev').click();
    });

    it('leave a course', () => {
        // TODO dit geeft nog errors, iets fout met backend misschien?
        // cy.contains('Leave').click();
    });

    it('join a course', () => {
    //     TODO add some open courses
    });

});