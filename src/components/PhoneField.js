'use client';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function PhoneField({ label, required, value, onChange, error }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <PhoneInput
        international
        defaultCountry="IN"
        countryCallingCodeEditable={false}
        value={value}
        onChange={onChange}
        className={`phone-field${error ? ' phone-field-error' : ''}`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </label>
  );
}
