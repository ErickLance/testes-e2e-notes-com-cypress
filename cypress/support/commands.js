// cypress/support/commands.js

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
    cy.wait('@getNotes', { requestTimeout: 10000 }).its('response.statusCode').should('eq', 200)

  })
})

Cypress.Commands.add('login', (
  user = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  cy.intercept('GET', '**/notes').as('getNotes')

  cy.visit('/login')
  cy.get('#email').type(user)
  cy.get('#password').type(password)
  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')
})
