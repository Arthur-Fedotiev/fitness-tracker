export const getGoogleProviderBtn = () =>
  cy.get('[data-provider-id="google.com"]');

export const getEmailProviderBtn = () =>
  cy.get('[data-provider-id="password"]');
