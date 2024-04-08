describe('Login', () => {
    it('should successfully initiate login via CAS', () => {
        cy.visit('http://localhost:3000/');

        // click login button
        cy.get('button').click();

        // login microsoft, fill in password and do 2FA manually. (for now)
        cy.origin(
            'https://login.microsoftonline.com',
            () => {
                cy.get('input[type="email"]').type("email")
                cy.get('input[type="submit"]').click()
                // cy.get('input[type="password"]').type("", {
                //   log: false,
                // })
                cy.get('input[type="submit"]').click()
            });

    });
});