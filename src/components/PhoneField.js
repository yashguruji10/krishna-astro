'use client';

import PhoneInput from 'react-phone-number-input/max';
import 'react-phone-number-input/style.css';

export default function PhoneField({ label, required, value, onChange, onBlur, error }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <PhoneInput
        international
        defaultCountry="IN"
        countryCallingCodeEditable={false}
        limitMaxLength
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`phone-field${error ? ' phone-field-error' : ''}`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </label>
  );
}
