import {teacherUsername, teacherPassword} from '../../fixtures/login.json';

describe('go to home page as teacher', () => {
    beforeEach(() => {
        cy.login(teacherUsername, teacherPassword);
        cy.contains('Create Course').click();
        cy.wait(1000); // give the page some time to load
        cy.url().should('eq', 'http://localhost:3000/en/course/add');
    });

    it('go to create course page, check everything and go back to home', () => {
        cy.contains('Create Course').click();

        cy.contains('Course name');
        cy.contains('Banner');
        cy.contains('Description');
        cy.contains('Access');
        cy.contains('Select image')
        cy.get('#choice').should('exist');

        cy.contains('Create Course');
        cy.contains('Cancel').click({force: true});

        cy.url().should('eq', 'http://localhost:3000/en/home');
    });

    it('create course', () => {
        //     fill in the text boxes
        cy.get('#name').type('Test Course');
        cy.get('textarea[name="description"]').type('Test description for course');
        // make course public
        cy.get('#choice').click();
        cy.contains('Public').click();
        cy.contains('Create Course').click();
    //     TODO create course werkt blijkbaar nog niet ?
    });
});