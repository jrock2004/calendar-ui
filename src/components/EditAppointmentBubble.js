import React, { useState } from 'react';

import {UiInput} from './UiInput';
import {UiSelect} from './UiSelect';
import {InputSuggest} from './input/InputSuggest';

import { createEventId } from '../data/events';
import {services} from '../data/services';
import {resources} from '../data/resources';
import {customers} from '../data/customers';

export const EditAppointmentBubble = ({event, selectInfo, toggleEditAppointment}) => {
  const [state, setState] = useState({
    customerName: selectInfo ? selectInfo.customerName : '',
    employeeId: selectInfo ? selectInfo.resourceId : '',
    employeeName: selectInfo ? selectInfo.resourceTitle : '',
    event: event,
    selectInfo: selectInfo,
    selectedServiceId: selectInfo ? selectInfo.selectedServiceId : '',
  });

  const handleClose = () => {
    setState({
      customerName: '',
      resourceId: '',
      resourceTitle: '',
      selectedServiceId: '',
    });

    toggleEditAppointment();
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('Updating Appt is not implemented at this time')
  }

  return (
    <form
      className="absolute border w-1/3 right-0 bottom-0 new-appointment bg-white flex flex-col"
      onSubmit={handleSubmit}
    >
      <header className="bg-black text-white px-4 py-2 flex justify-between">
        <h4>Edit Appointment</h4>
        <button type="button" onClick={handleClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>
      <main className="px-4 py-8 flex flex-col">
        <div>
          <InputSuggest
            suggestions={customers}
            label="Customer Name"
            handleClick={handleSelectCustomer}
            initialValue={state.customerName}
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
        <div className="mt-6">
          <ul className="flex">
            <li className="mr-4">
              <button className="text-teal-600">Take Payment</button>
            </li>
            <li>
              <button className="text-teal-600">Cancel Appointment</button>
            </li>
          </ul>
        </div>
      </main>
      <footer className="mt-auto border-t px-4 py-6">
        <button
          type="submit"
          className="border rounded-sm bg-teal-400 text-white text-xl uppercase x-4 py-2 w-full"
        >
          Update Appointment
        </button>
      </footer>
    </form>
  )
}

export default EditAppointmentBubble;
