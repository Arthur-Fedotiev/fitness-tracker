import { Language } from '../support/utils';

describe('Exercise', () => {
  beforeEach(() => {
    cy.login();
  });
  afterEach(() => cy.logout());

  it('should allow a user to filter by multiple target muscles', () => {
    const targetMuscle = 'GLUTES';

    cy.visit(`/exercises/all?targetMuscles=["${targetMuscle}"]`);

    cy.dataCy('targetMuscles').should('be.visible').and('contain', 'Glutes');
    cy.selectLanguage(Language.English);

    cy.dataCy('exerciseTargetMuscle')
      .should('be.visible')
      .and('contain', 'Glutes');
  });

  it('should allow a user to filter by multiple target muscles', () => {
    const targetMuscles = ['"GLUTES"', '"QUADRICEPS"'];

    cy.visit(`/exercises/all?targetMuscles=[${targetMuscles.join(',')}]`);
    cy.selectLanguage(Language.English);

    cy.dataCy('targetMuscles').as('selectedMuscles').should('be.visible');

    cy.get('@selectedMuscles').should('contain', 'Glutes');
    cy.get('@selectedMuscles').should('contain', 'Quadriceps');

    cy.dataCy('exerciseTargetMuscle')
      .as('exerciseTargetMuscle')
      .should('be.visible');

    cy.get('@exerciseTargetMuscle').should('contain', 'Glutes');
    cy.get('@exerciseTargetMuscle').should('contain', 'Quadriceps');
  });

  it('should display exercise details in a dialog, containing video instructions, which could be closed', () => {
    cy.visit('/exercises/all');

    cy.dataCy('exerciseViewBtn').first().click();

    cy.get('components-exercise-details').should('be.visible');

    cy.dataCy('exerciseInstructionsVideo')
      .should('have.prop', 'paused', true)
      .and('have.prop', 'ended', false);

    cy.dataCy('closeExerciseDetailsDialog').click();
    cy.get('components-exercise-details').should('not.exist');

    cy.dataCy('exerciseViewBtn').first().click();
    cy.get('components-exercise-details').should('be.visible');
    cy.clickOutside();
    cy.get('components-exercise-details').should('not.exist');
  });

  it('should disable load more button when there are no exercises in the database', () => {
    cy.visit('/exercises/all', {
      qs: {
        targetMuscles: '["NOT_EXISTING_MUSCLE"]',
      },
    });

    cy.dataCy('loadMoreExercisesBtn').should('be.disabled');
  });

  it('should allow a user to edit an exercise', () => {
    cy.visit('/exercises/all');

    cy.dataCy('exerciseName')
      .first()
      .then(($exerciseTitleEl) => {
        cy.dataCy('editExerciseBtn').first().click();
        cy.url().should('include', '/edit');

        cy.dataCy('exerciseNameInput')
          .first()
          .should('have.value', $exerciseTitleEl.text());
      });
  });
});
