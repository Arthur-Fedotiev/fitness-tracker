export enum CREATE_USER_APP_MESSAGES {
  'POST_RECEIVED' = 'Calling create user function.',
  'ACCESS_DENIED' = 'Denied access to user creation service.',
  'CREATE_SUCCESS' = 'User created successfully.',
  'CREATE_FAILURE' = 'Could not create user.',
}

export enum CREATE_USER_MIDDLEWARE_MESSAGES {
  'ATTEMPT_EXTRACT_CREDS' = 'Attempting to extract user credentials from request.',
  'JWT_VALIDATION_ERR' = 'Error ocurred while validating JWT',
}
