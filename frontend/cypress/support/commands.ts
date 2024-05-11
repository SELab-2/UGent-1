export {}

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('http://localhost:8000/api-auth/login/?next=/');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[type=submit').click()
    cy.visit('http://localhost:3000/en/home');
    cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({
            "data": {
                "id": 1,
                "email": "alexander.vanoyen@sel2-1.ugent.be",
                "first_name": "Alexander",
                "last_name": "Van Oyen",
                "course": [1,3,4,5,6,7,8,9,10,2],
                "role": 3,
                "picture": "http://localhost:8000/media/profile_pictures/default_picture.png"
            },
            "lastcache": "1715417897558"
        }));
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

