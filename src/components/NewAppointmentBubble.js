import React, { useState } from 'react';
import addMinutes from 'date-fns/addMinutes';
import formatISO from 'date-fns/formatISO';

import {UiInput} from './UiInput';
import {UiSelect} from './UiSelect';
import { createEventId } from '../data/events';
import {services} from '../data/services';
import {resources} from '../data/resources';

export const NewAppointmentBubble = ({selectInfo, toggleNewAppointment}) => {
  const [state, setState ] = useState({
    customerName: '',
    employeeId: selectInfo ? selectInfo.resource.id : '',
    employeeName: selectInfo ? `with ${selectInfo.resource.title}` : '',
    selectedServiceId: '',
  });

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

    const calendarApi = selectInfo.view.calendar;
    const selectedServiceId = state.selectedServiceId;

    // If they did not select a service
    if (!selectedServiceId) return;

    const service = services.find(serv => serv.id === selectedServiceId);
    const customerName = state.customerName;
    const endTime = addMinutes(selectInfo.start, service.duration);

    calendarApi.unselect();

    if (service && customerName) {
      calendarApi.addEvent({
        id: createEventId(),
        title: service.name,
        start: selectInfo.startStr,
        end: formatISO(endTime),
        resourceId: state.employeeId,
        customer: {
          fullName: customerName
        }
      });
    }

    toggleNewAppointment();
  }

  const handleClose = () => {
    setState({
      customerName: '',
      employeeId: '',
      employeeName: '',
      selectedServiceId: '',
    });

    toggleNewAppointment();
  }

  return (
    <form className="absolute border w-1/3 right-0 bottom-0 new-appointment bg-white flex flex-col" onSubmit={handleSubmit}>
      <header className="bg-black text-white px-4 py-2 flex justify-between">
        <h4>New Appointment {state.employeeName}</h4>
        <button onClick={handleClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>
      <main className="px-4 py-8">
        <UiInput
          name="customerName"
          label="Customer Name"
          value={state.customerName}
          handleChange={handleChange}
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
      </main>

      <footer className="mt-auto border-t px-4 py-6">
        <button
          type="submit"
          className="border rounded-sm bg-teal-400 text-white text-xl uppercase x-4 py-2 w-full"
        >
          Book {state.employeeName}
        </button>
      </footer>
    </form>
  )
};

export default NewAppointmentBubble;
