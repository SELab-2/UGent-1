export {}

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8000/auth/login/',
        body: {
            "username": username,
            "password": password,
        },
    }).then((resp) => {
        if (resp.status == 200) {
            cy.visit('http://localhost:3000/home');
        }
    });
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

