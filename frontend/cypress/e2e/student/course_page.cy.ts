import {studentUsername, studentPassword} from '../../fixtures/login.json';

describe('student course page', () => {
    beforeEach(() => {
        cy.login(studentUsername, studentPassword);
    });

    it('go to course page ', () => {
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/1');

        cy.contains('Artificiële intelligentie');

        cy.contains('Description');
        cy.contains('Kennisgebaseerd redeneren, machinaal leren, heuristische zoekstrategieën,' +
            ' neurale netwerken en deep learning, natuurlijke taalverwerking');


        cy.contains('Projects');
        cy.contains('AI project')
        cy.contains('12/12/2021 13:12')
        cy.contains('View students');
    });

    it('view students in course page ', () => {
        cy.contains('Artificiële intelligentie').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/1');

        cy.contains('View students').click();

        cy.url().should('eq', 'http://localhost:3000/en/course/1/students');
    });


    it('next and prev on students, and go back to course page ', () => {
        cy.contains('Artificiële intelligentie').click();
        cy.contains('View students').click();

        cy.contains('Next').click();
        cy.contains('Prev').click();

        cy.contains('Back to Course').click();
    });
});