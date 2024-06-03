Cypress.Commands.add('login', (email, password) => {
    cy.request('/login').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/session',
        body: {
          email,
          password,
          _csrf: csrfToken,
        },
      });
    });
  });
  