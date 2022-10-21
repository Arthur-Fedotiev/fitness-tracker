import { getEmailProviderBtn, getGoogleProviderBtn } from '../support/login.po';

describe('Login', () => {
  afterEach(() => cy.logout());

  it('should allow a user to login by email or google-provider', () => {
    cy.visit('/');

    getGoogleProviderBtn().should('be.visible');
    getEmailProviderBtn().should('be.visible');
  });

  it('should redirect to exercises after user logged in', () => {
    cy.login();
    cy.visit('/');

    cy.url().should('include', '/exercises/all');
  });
});
