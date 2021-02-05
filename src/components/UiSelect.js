import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@mbkit/label';
import { Select } from '@mbkit/select';

export const UiSelect = ({ name, label, value, handleChange, children }) => {
  return (
    <div className="flex flex-col mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} value={value} onChange={handleChange}>
        {children}
      </Select>
    </div>
  );
};

UiSelect.propTypes = {
  children: PropTypes.array,
  handleChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default UiSelect;
