import React, { useState } from 'react';

import { customers } from '../../data/customers';
import { resources } from '../../data/resources';
import { services } from '../../data/services';

import { InputSuggest } from '../inputSuggest/InputSuggest';
import { UiSelect } from '../UiSelect';
import { GetAppointmentTime } from './GetAppointmentTime';

export const AppointmentWrapper = ({customerName, employeeId, employeeName, end, selectedServiceId, start}) => {
  const [state, setState] = useState({
    customerName: customerName,
    employeeId: employeeId,
    employeeName: employeeName,
    end: end,
    employeeId: employeeId,
    employeeName: employeeName,
    selectedCustomer: null,
    selectedServiceId: selectedServiceId,
    start: start
  });

  const handleSelectCustomer = (item) => {
    const customerName = `${item.firstName} ${item.lastName}`;

    setState({
      ...state,
      selectedCustomer: item,
      customerName: customerName,
    });
  }

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  const handleEmployeeChange = (event) => {
    const value = event.target.value;
    const resource = resources.find(res => res.id === value);

    setState({
      ...state,
      employeeId: resource.id,
      employeeName: `with ${resource.title}`,
    })
  }

  return (
    <div>
      <GetAppointmentTime end={state.end} start={state.start} />

      <InputSuggest
        initialValue={state.customerName}
        handleClick={handleSelectCustomer}
        label="Customer Name"
        suggestions={customers}
      />

      <UiSelect
        name="selectedServiceId"
        label="Choose a service"
        value={state.selectedServiceId}
        handleChange={handleChange}
      >
        <option>Please select a service</option>
        {services.map(service =>
          <option key={service.id} value={service.id}>{service.name}</option>
        )}
      </UiSelect>

      <UiSelect
        name="employeeId"
        label="Choose a employee"
        value={state.employeeId}
        handleChange={handleEmployeeChange}
      >
        <option>Please select a employee</option>
        {resources.map(resource =>
          <option key={resource.id} value={resource.id}>{resource.title}</option>
        )}
      </UiSelect>
    </div>
  )
}

export default AppointmentWrapper;
