import { FormControl } from '@angular/forms';
import { nidValidator, phoneValidator, pastDateValidator } from './validators';

describe('Validators', () => {
  describe('nidValidator', () => {
    it('should validate correct NID', () => {
      const control = new FormControl('1234567890');
      const validator = nidValidator();
      expect(validator(control)).toBeNull();
    });

    it('should reject NID with less than 10 digits', () => {
      const control = new FormControl('123456789');
      const validator = nidValidator();
      expect(validator(control)).toEqual({ nid: 'NID must be 10 digits' });
    });

    it('should reject NID with more than 10 digits', () => {
      const control = new FormControl('12345678901');
      const validator = nidValidator();
      expect(validator(control)).toEqual({ nid: 'NID must be 10 digits' });
    });

    it('should reject NID with non-numeric characters', () => {
      const control = new FormControl('123456789a');
      const validator = nidValidator();
      expect(validator(control)).toEqual({ nid: 'NID must be 10 digits' });
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const validator = nidValidator();
      expect(validator(control)).toBeNull();
    });
  });

  describe('phoneValidator', () => {
    it('should validate correct phone number', () => {
      const control = new FormControl('+93700123456');
      const validator = phoneValidator();
      expect(validator(control)).toBeNull();
    });

    it('should reject phone without +93 prefix', () => {
      const control = new FormControl('700123456');
      const validator = phoneValidator();
      expect(validator(control)).toEqual({ phone: 'Phone must be in format +93XXXXXXXXX' });
    });

    it('should reject phone with incorrect length', () => {
      const control = new FormControl('+9370012345');
      const validator = phoneValidator();
      expect(validator(control)).toEqual({ phone: 'Phone must be in format +93XXXXXXXXX' });
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const validator = phoneValidator();
      expect(validator(control)).toBeNull();
    });
  });

  describe('pastDateValidator', () => {
    it('should validate past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const control = new FormControl(yesterday.toISOString().split('T')[0]);
      const validator = pastDateValidator();
      expect(validator(control)).toBeNull();
    });

    it('should reject future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const control = new FormControl(tomorrow.toISOString().split('T')[0]);
      const validator = pastDateValidator();
      expect(validator(control)).toEqual({ pastDate: 'Date must be in the past' });
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const validator = pastDateValidator();
      expect(validator(control)).toBeNull();
    });
  });
});
