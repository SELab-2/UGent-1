import {teacherUsername, teacherPassword, teacherEmail} from '../../fixtures/login.json';

describe('teacher project page', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
        cy.contains('Artificiële intelligentie').click();
    });

    it('go to project page ', () => {
        cy.contains('button', 'View').click();
        cy.url().should('eq', 'http://localhost:3000/en/project/2');
    });

});