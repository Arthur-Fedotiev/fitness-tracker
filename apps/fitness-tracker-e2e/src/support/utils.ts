export const dataCy = (selector: string, ...args: any[]): Cypress.Chainable =>
  cy.get(`[data-cy="${selector}"]`, ...args);

export enum Language {
  English,
  Italian,
  Russian,
  Ukrainian,
  Belorussian,
  Netherlands,
  French,
  German,
  Polish,
  Portuguese,
  Spanish,
}
export const selectLanguage = (language: Language) =>
  cy
    .get(
      '.mat-toolbar > .settings.ng-star-inserted > .settings > .mat-list > :nth-child(1) > .mat-list-item-content',
    )
    .click({ multiple: true })
    .get('mat-option')
    .eq(language)
    .click();

export const clickOutside = () => cy.get('body').click(0, 0);
