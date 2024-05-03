import { teacherUsername, teacherPassword } from '../../fixtures/login.json';

describe('go to home page as teacher', () => {
   beforeEach(() => {
         cy.login(teacherUsername, teacherPassword);
   });

    it('go to create course page, check everything', () => {
        cy.contains('Create Course').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/add');
    });

});