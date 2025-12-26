import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { z, ZodSchema } from 'zod';

export function zodValidator(schema: ZodSchema): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse(control.value);

    if (result.success) {
      return null;
    }

    const errors: ValidationErrors = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path || 'value'] = err.message;
    });

    return errors;
  };
}

export function nidValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const nid = control.value.toString();

    if (!/^\d{10}$/.test(nid)) {
      return { nid: 'NID must be 10 digits' };
    }

    return null;
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phone = control.value.toString();

    if (!/^\+93\d{9}$/.test(phone)) {
      return { phone: 'Phone must be in format +93XXXXXXXXX' };
    }

    return null;
  };
}

export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      return { pastDate: 'Date must be in the past' };
    }

    return null;
  };
}

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return { futureDate: 'Date must be in the future' };
    }

    return null;
  };
}
