import React, { useState } from 'react';

import { createEventId } from '../data/events';
import {services} from '../data/services';

export const NewAppointmentBubble = ({selectInfo, toggleNewAppointment}) => {
  const [state, setState ] = useState({
    employeeId: selectInfo.resource.id,
    customerName: '',
    selectedServiceId: '',
  });

  const employeeName = selectInfo ? `with ${selectInfo.resource.title}` : null;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const calendarApi = selectInfo.view.calendar;
    const selectedServiceId = state.selectedServiceId;

    // If they did not select a service
    if (!selectedServiceId) return;

    const service = services.find(serv => serv.id === selectedServiceId);
    const customerName = state.customerName;

    calendarApi.unselect();

    if (service && customerName) {
      calendarApi.addEvent({
        id: createEventId(),
        title: service.name,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        resourceId: selectInfo.resource.id,
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
      selectedServiceId: '',
    });

    toggleNewAppointment();
  }

  return (
    <form className="absolute border w-1/3 right-0 bottom-0 new-appointment bg-white flex flex-col" onSubmit={handleSubmit}>
      <header className="bg-black text-white px-4 py-2 flex justify-between">
        <h4>New Appointment {employeeName}</h4>
        <button onClick={handleClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>
      <main className="px-4 py-8">
        <div className="flex flex-col mb-4">
          <label htmlFor="new-appointment-customer" className="mb-2 font-semibold text-sm">Customer Name</label>
          <input
            type="text"
            className="border w-full px-2 py-1 rounded-sm"
            name="customerName"
            id="new-appointment-customer"
            value={state.customerName}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="new-appointment-services" className="mb-2 font-semibold text-sm">Choose a service</label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              name="selectedServiceId"
              value={state.selectedServiceId}
              onChange={handleChange}
            >
              <option>Please select a service</option>
              {services.map(service =>
                <option key={service.id} value={service.id}>{service.name}</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t px-4 py-6">
        <button
          type="submit"
          className="border rounded-sm bg-teal-400 text-white text-xl uppercase x-4 py-2 w-full"
        >
          Book {employeeName}
        </button>
      </footer>
    </form>
  )
};

export default NewAppointmentBubble;
