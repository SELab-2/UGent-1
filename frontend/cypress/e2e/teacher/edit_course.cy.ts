import {teacherUsername, teacherPassword, teacherEmail} from '../../fixtures/login.json';

describe('teacher course page', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
        cy.contains('Algoritmen en datastructuren 3').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/2');
    });

    it('edit course and check if updated correctly ', () => {
        cy.contains('Edit course').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/2/edit');

        // Check everything
        cy.contains('Course name');
        cy.contains('Banner');
        cy.contains('Description');
        cy.contains('Access');
        cy.contains('Select image');
        cy.get('#choice').should('exist');
        cy.contains('Save changes');
        cy.contains('Cancel');

        // Edit the course
        cy.get('#name').clear().type('Algoritmen en datastructuren 3 - Edited');
        cy.get('textarea[name="description"]').clear().type('Test description for course - Edited');
        cy.get('#choice').click();
        cy.contains('Private').click();
        cy.contains('Save changes').click();

        cy.contains('Cancel').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/2');

    //     check that everything got updated
        cy.contains('Algoritmen en datastructuren 3 - Edited');
        cy.contains('Test description for course - Edited');
        cy.contains('Private course');
    });

    it('edit course back to starting state', () => {
        cy.contains('Edit course').click();
        cy.url().should('eq', 'http://localhost:3000/en/course/2/edit');

        // Edit the course
        cy.get('#name').clear().type('Algoritmen en datastructuren 3');
        cy.get('textarea[name="description"]').clear().type('Algoritme, datastructuur, efficiëntie');
        cy.get('#choice').click();
        cy.contains('Public').click();
        cy.contains('Save changes').click();
    });
});