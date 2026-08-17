import { getEmailProviderBtn, getGoogleProviderBtn } from '../support/login.po';

describe('Login', () => {
  afterEach(() => cy.logout());

  it('should allow a user to login by email or google-provider', () => {
    cy.visit('/');

    getGoogleProviderBtn().should('be.visible');
    getEmailProviderBtn().should('be.visible');
  });

  it('should login by email and password and be redirected to the training planner', () => {
    cy.visit('/');
    getEmailProviderBtn().click();

    cy.get('#ui-sign-in-email-input').type(Cypress.env('EMAIL'));
    cy.get('button[type="submit"]').click();

    cy.get('#ui-sign-in-password-input').type(Cypress.env('PASSWORD'));
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/training-planner');
  });

  it('should redirect to the training planner after user logged in', () => {
    cy.login();
    cy.visit('/');

    cy.url().should('include', '/training-planner');
  });
});
