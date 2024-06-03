describe('Todo test suite', () => {
  const CST = (days) => {
    if (!Number.isInteger(days)) {
      throw new Error('Need to pass an integer as days');
    }
    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    return new Date(today.getTime() + days * oneDay);
  };

  beforeEach(() => {
    cy.task('db:reset'); 
    cy.visit('/login'); 
    cy.login('test@test.com', 'password'); 
  });

  it('responds with json at /todos POST endpoint', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy milk',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('Sign out', () => {
    cy.visit('/todos');
    cy.get('form[action="/signout"]').submit();
    cy.visit('/todos');
    cy.url().should('include', '/login');
  });

  it('Marks a todo with the given ID as complete', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy milk',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
    });
  });

  it('Fetches all todo in the database using /todos endpoint', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy xbox',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy ps3',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
    });
  });

  it('Deletes a todo with the given ID if it exists and sends a boolean response', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy xbox',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      }).then((response) => {
        const todoID = response.body.id;
        cy.request({
          method: 'DELETE',
          url: `/todos/${todoID}`,
          body: {
            _csrf: csrfToken,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.body).to.be.true;
        });
      });
    });
  });

  it('Should not create a todo item with empty dueDate', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Buy milk',
          dueDate: '',
          completed: false,
          _csrf: csrfToken,
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it('Should create sample due today item', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'sample due today item',
          dueDate: new Date().toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
    });
  });

  it('Should create sample due later item', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'sample due later item',
          dueDate: CST(2).toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
    });
  });

  it('Should create sample overdue item', () => {
    cy.request('/todos').then((res) => {
      const csrfToken = Cypress.$('[name=_csrf]', res.body).val();
      cy.request({
        method: 'POST',
        url: '/todos',
        body: {
          title: 'Sample overdue item',
          dueDate: CST(-2).toISOString(),
          completed: false,
          _csrf: csrfToken,
        },
      });
    });
  });
});
