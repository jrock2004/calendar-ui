import React from 'react';

import { customers } from '../../data/customers';
import { resources } from '../../data/resources';
import { services } from '../../data/services';

import { InputSuggest } from '../inputSuggest/InputSuggest';
import { UiSelect } from '../UiSelect';
import { GetAppointmentTime } from './GetAppointmentTime';

export const AppointmentWrapper = ({
  customerName,
  employeeId,
  end,
  selectedServiceId,
  start,
  handleChange,
  handleEmployeeChange,
}) => {
  return (
    <div>
      {start && end && <GetAppointmentTime end={end} start={start} />}

      <InputSuggest
        initialValue={customerName}
        handleClick={handleChange}
        label="Customer Name"
        suggestions={customers}
      />

      <UiSelect
        name="selectedServiceId"
        label="Choose a service"
        value={selectedServiceId}
        handleChange={handleChange}
      >
        <option>Please select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </UiSelect>

      <UiSelect
        name="employeeId"
        label="Choose a employee"
        value={employeeId}
        handleChange={handleEmployeeChange}
      >
        <option>Please select a employee</option>
        {resources.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.title}
          </option>
        ))}
      </UiSelect>
    </div>
  );
};

export default AppointmentWrapper;
