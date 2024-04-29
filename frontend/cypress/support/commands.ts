export {}

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('http://localhost:8000/api-auth/login/?next=/');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[type=submit').click()
    cy.visit('http://localhost:3000/home', {timeout: 2000});
});


declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            login(username: string, password: string): Chainable<void>;

            // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
            // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
        }
    }
}

