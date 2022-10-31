describe('Exercise Edit', () => {
  const TEST_ID = 'test-exercise18264246';
  const exerciseStub = {
    translatableData: {
      benefits: 'Test Exercise',
      instructions: 'Test Exercise',
      name: 'Test Exercise',
      shortDescription: 'Test Exercise',
      longDescription: 'Test Exercise',
    },
    baseData: {
      exerciseType: 'STRENGTH',
      targetMuscle: 'NECK',
      equipment: 'BARBELL',
      coverUrl: 'https://www.google.com',
      coverSecondaryUrl: 'https://www.google.com',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9XSxNDCGzb8VnsgX0Y0eewB-cx7IyH4yLyxeWaq1hbRfGLtcwkdbtYNtVlQGHL6hjU8o&usqp=CAU',

      avatarSecondaryUrl: 'https://www.google.com',

      instructionVideo: 'https://www.google.com',
      muscleDiagramUrl: 'https://www.google.com',
      rating: 5,
    },
  };

  beforeEach(() => {
    cy.login();
  });
  afterEach(() => cy.logout());

  xit('should create exercise filling in only necessary (required) fields and redirect to exercises display page', () => {
    cy.visit('/');
    cy.dataCy('navLinkCreateExercise', {
      timeout: 3_000,
    })
      .first()
      .click({ force: true });
    cy.url().should('include', '/exercises/create');

    cy.dataCy('exerciseCreateAndEditForm').should('be.visible');

    cy.dataCy('saveExerciseBtn').as('saveBtn').should('be.disabled');

    cy.dataCy('exerciseNameInput').type(exerciseStub.translatableData.name);
    cy.get('@saveBtn').should('be.disabled');

    cy.selectMatOption('exerciseTypeSelect');
    cy.get('@saveBtn').should('be.disabled');

    cy.selectMatOption('exerciseTargetMuscleSelect');
    cy.get('@saveBtn').should('be.disabled');

    cy.selectMatOption('exerciseEquipmentSelect');
    cy.get('@saveBtn').should('be.disabled');

    cy.dataCy('exerciseAvatarUrlInput').type(exerciseStub.baseData.avatarUrl);
    cy.get('@saveBtn').should('be.disabled');

    cy.dataCy('exerciseRatingInput')
      .type(String(exerciseStub.baseData.rating))
      .trigger('change');

    cy.get('@saveBtn').should('be.enabled').click();

    cy.callFirestore('delete', 'exercises', {
      where: [
        'translatableData.name',
        '==',
        exerciseStub.translatableData.name,
      ],
    });

    cy.url().should('include', '/exercises/all');
  });

  it.only('should edit exercise', () => {
    cy.callFirestore('set', `exercises/${TEST_ID}`, exerciseStub);
    const editedName = 'Edited Exercise Name';

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    // cy.wait(10_000);

    cy.visit(`/exercises/${TEST_ID}/edit`).contains(
      exerciseStub.translatableData.name,
      {
        timeout: 10_000,
      },
    );

    cy.dataCy('exerciseCreateAndEditForm')
      .should('be.visible')
      .dataCy('saveExerciseBtn')
      .as('saveBtn')
      .should('be.disabled');

    cy.dataCy('exerciseNameInput').type(editedName);
    cy.get('@saveBtn').should('be.enabled').click();

    cy.callFirestore('delete', `exercises/${TEST_ID}`);

    cy.url().should('include', '/exercises/all');
  });
});
