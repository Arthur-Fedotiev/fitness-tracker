import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** `Validators.min` is inclusive of 0 — this enforces the strictly-positive (`>0`) bound ticket 06 requires. */
export const positiveNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: unknown = control.value;
  if (value == null || value === '') {
    return null;
  }
  return typeof value === 'number' && value > 0 ? null : { positiveNumber: true };
};
