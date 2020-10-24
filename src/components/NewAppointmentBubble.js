import React, { useState } from 'react';


import { createEventId } from '../data/events';

export const NewAppointmentBubble = ({selectInfo, toggleNewAppointment}) => {
  const [state, setState ] = useState({
    title: '',
    employeeId: selectInfo.resource.id,
  });

  const employeeName = selectInfo ? `with ${selectInfo.resource.title}` : null;

  console.log(selectInfo);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let calendarApi = selectInfo.view.calendar;
    const title = state.title;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        resourceId: selectInfo.resource.id
      });
    }

    toggleNewAppointment();
  }

  const handleClose = () => {
    setState({
      title: '',
      employeeId: '',
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
        <div className="flex flex-col">
          <label htmlFor="new-appointment-title" className="mb-2 font-semibold text-sm">Title</label>
          <input
            type="text"
            className="border w-full px-2 py-1 rounded-sm"
            name="title"
            id="new-appointment-title"
            value={state.title}
            onChange={handleChange}
          />
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
