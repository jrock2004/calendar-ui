// import React, { Component, createRef } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import addMinutes from 'date-fns/addMinutes';
// import { Heading } from '@mbkit/typography';
// import { Toaster } from '@mbkit/toaster';
// import { IconClose } from '@mbkit/icon';

// import { createEventId, INITIAL_EVENTS } from './data/events';
// import resources from './data/resources';
// import { services } from './data/services';

import React, { createRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import addMinutes from 'date-fns/addMinutes';
import { Heading } from '@mbkit/typography';

import renderEventContent from './components/RenderEventContent';
import resourceContent from './components/ResourceContent';
import BubbleContainer from './components/BubbleContainer';
import AppointmentWrapper from './components/AppointmentBubble/AppointmentWrapper';

import './App.css';

const HOST = 'https://scheduling-99b8a.firebaseio.com';

const App = () => {
  const [resources, setResources] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);
  const [bubble, setBubble] = useState({
    showNewAppointmentBubble: false,
  });
  const [selectedEvent, setSelectedEvent] = useState({
    customerId: null,
    employeeId: '',
    employeeName: '',
    end: null,
    endStr: null,
    notes: '',
    serviceId: '',
    start: null,
    startStr: null,
  });

  const calendarRef = createRef();

  async function requestResources(type) {
    if (!type) return;

    let response = await fetch(`${HOST}/${type}.json`).then((res) => res.json());

    if (type === 'resources') setResources(response || []);
    else if (type === 'customers') setCustomers(response || []);
    else if (type === 'services') setServices(response || []);
    else if (type === 'events') setEvents(response || []);
    else console.error('You do not have a use state for this setup yet');
  }

  useEffect(() => {
    requestResources('resources');
    requestResources('customers');
    requestResources('services');
    requestResources('events');
  }, []);

  let resetSelectedEvent = () => {
    setSelectedEvent({
      customerId: null,
      employeeId: '',
      employeeName: '',
      end: null,
      endStr: null,
      eventId: null,
      notes: '',
      serviceId: '',
      start: null,
      startStr: null,
    });
  };

  let toggleNewAppointment = () => {
    let { showNewAppointmentBubble } = bubble;

    // If we are closing the bubble, clear out old values
    if (showNewAppointmentBubble) {
      resetSelectedEvent();
    }

    setBubble({
      ...bubble,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: !showNewAppointmentBubble,
    });
  };

  let toggleEditAppointment = () => {
    let { showEditAppointmentBubble } = bubble;

    // If we are closing the bubble, clear out old values
    if (showEditAppointmentBubble) {
      resetSelectedEvent();
    }

    setBubble({
      ...bubble,
      showEditAppointmentBubble: !bubble.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
    });
  };

  let handleDateClick = (selectInfo) => {
    let { end, endStr, resource, start, startStr } = selectInfo;

    setSelectedEvent({
      ...selectedEvent,
      end,
      endStr,
      employeeId: resource.id,
      employeeName: resource.title,
      start,
      startStr,
    });

    toggleNewAppointment();
  };

  let handleEventClick = (info) => {
    let event = events.find((ev) => ev.id === +info.event.id),
      employee = resources.find((em) => em.id === +event.resourceId),
      service = services.find((ser) => ser.name === event.title);

    setSelectedEvent({
      ...selectedEvent,
      customerId: event.customer.id,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      end: new Date(event.end),
      endStr: event.end,
      eventId: event.id,
      notes: event.notes || '',
      serviceId: service.id,
      start: new Date(event.start),
      startStr: event.start,
    });

    toggleEditAppointment();
  };

  let handleChange = (event) => {
    if (event && event.lastName) {
      setSelectedEvent({
        ...selectedEvent,
        customerId: event.id,
      });
    } else if (event && event.target.name === 'serviceId') {
      let service = services.find((serv) => serv.id === +event.target.value),
        calendarApi = calendarRef.current.getApi(),
        endDate = addMinutes(selectedEvent.start, service.duration);

      setSelectedEvent({
        ...selectedEvent,
        end: endDate,
        endStr: calendarApi.formatIso(endDate),
        serviceId: service.id.toString(),
      });
    } else {
      setSelectedEvent({
        ...selectedEvent,
        [event.target.name]: event.target.value,
      });
    }
  };

  let handleSubmit = (event) => {
    event.preventDefault();

    let currentEvents = events,
      { customerId, employeeId, endStr, eventId, notes, serviceId, startStr } = selectedEvent,
      calendarApi = calendarRef.current.getApi(),
      newId = +currentEvents.slice(-1)[0].id + 1,
      customer = customers.find((cs) => cs.id === +customerId),
      service = services.find((ser) => ser.id === +serviceId);

    // eslint-disable-next-line
    // debugger;

    if (bubble.showEditAppointmentBubble) {
      let someEvent = calendarApi.getEventById(eventId);
      // let someEvent = currentEvents.find((ev) => ev.id === eventId);
      // console.log(selectedEvent, someEvent);

      // eslint-disable-next-line
      // debugger;

      someEvent.setProp('notes', notes);
      someEvent.setExtendedProp('notes', notes);
      // someEvent.setStart(new Date(), {});
    } else {
      calendarApi.addEvent(
        {
          customer,
          end: endStr,
          id: newId,
          notes,
          employeeId: employeeId.toString(),
          start: startStr,
          title: service.name,
        },
        true
      );

      toggleNewAppointment();
    }
  };

  let handleEventAdd = (event) => {
    let newEvent = event.event.toPlainObject();

    let data = [
      ...events,
      {
        customer: newEvent.extendedProps.customer,
        end: newEvent.end,
        id: newEvent.id,
        notes: newEvent.extendedProps.notes,
        resourceId: newEvent.extendedProps.employeeId,
        start: newEvent.start,
        title: newEvent.title,
      },
    ];

    fetch(`${HOST}/events.json`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        setEvents(response);
        setSelectedEvent({
          customerId: null,
          employeeId: '',
          employeeName: '',
          end: null,
          endStr: null,
          notes: '',
          serviceId: '',
          start: null,
          startStr: null,
        });
      });
  };

  let handleEventChange = (info) => {
    console.log(info.event.toPlainObject(), info.oldEvent.toPlainObject());
  };

  return (
    <>
      <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
        <Heading as="h1" color="primary">
          Scheduling
        </Heading>
      </header>
      <main className="px-6 pt-4">
        <FullCalendar
          allDaySlot={false}
          editable={true}
          events={events}
          eventAdd={handleEventAdd}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          eventContent={renderEventContent}
          eventResourceEditable={true}
          initialView="resourceTimeGridDay"
          nowIndicator={true}
          plugins={[resourceTimeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          resourceLabelContent={resourceContent}
          resources={resources}
          select={handleDateClick}
          selectable={true}
          selectConstraint="businessHours"
          slotDuration="00:15:00"
          slotMaxTime="20:00:00"
          slotMinTime="08:00:00"
        />

        {bubble.showNewAppointmentBubble && (
          <BubbleContainer
            submitButtonText="Book"
            title={`New Appointment with ${selectedEvent.employeeName}`}
            toggleBubble={toggleNewAppointment}
            handleSubmit={handleSubmit}
          >
            <AppointmentWrapper
              customers={customers}
              isEditAppointment={false}
              employees={resources}
              services={services}
              selectedEvent={selectedEvent}
              handleChange={handleChange}
            />
          </BubbleContainer>
        )}

        {bubble.showEditAppointmentBubble && (
          <BubbleContainer
            submitButtonText="Update"
            title="Edit Appointment"
            toggleBubble={toggleEditAppointment}
            handleSubmit={handleSubmit}
          >
            <AppointmentWrapper
              customers={customers}
              isEditAppointment={true}
              employees={resources}
              services={services}
              selectedEvent={selectedEvent}
              handleChange={handleChange}
            />
          </BubbleContainer>
        )}
      </main>
    </>
  );
};

export default App;
/*
  handleEventClick = ({ event }) => {
    let { end, extendedProps, start, title } = event,
      { customer, notes } = extendedProps,
      customerName = `${customer.firstName} ${customer.lastName}`,
      selectedService = services.find((serv) => serv.name === title),
      eventResource = event.getResources()[0];

    this.setState({
      ...this.state,
      calendarApi: this.calendarRef,
      customerName: customerName,
      employeeId: eventResource.id,
      employeeName: eventResource.title,
      endTime: end,
      isEditAppointment: true,
      notes: notes,
      selectedEvent: event,
      selectedServiceId: selectedService.id,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
      startTime: start,
    });
  };

  handleToastMessage = () => {
    this.setState({
      ...this.state,
      showToast: false,
    });
  };

  render() {
    return (
      <>
        <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
          <Heading as="h1" color="primary">
            Scheduling
          </Heading>
        </header>
        <main className="px-6 pt-4">
          <FullCalendar
            allDaySlot={false}
            editable={true}
            eventClick={this.handleEventClick}
            eventChange={this.handleEventChange}
            eventContent={renderEventContent}
            initialEvents={INITIAL_EVENTS}
            initialView="resourceTimeGridDay"
            nowIndicator={true}
            plugins={[resourceTimeGridPlugin, interactionPlugin]}
            ref={this.calendarRef}
            resourceLabelContent={resourceContent}
            resources={this.state.resources}
            select={this.handleDateClick}
            selectable={true}
            selectConstraint="businessHours"
            slotDuration="00:15:00"
            slotMaxTime="20:00:00"
            slotMinTime="08:00:00"
          />

          {this.state.showNewAppointmentBubble && (
            <BubbleContainer
              submitButtonText="Book"
              title={`New Appointment with ${this.state.employeeName}`}
              toggleBubble={this.toggleNewAppointment}
              handleSubmit={this.handleSubmit}
            >
              <AppointmentWrapper
                employeeId={this.state.employeeId}
                end={this.state.endTime}
                handleChange={this.handleChange}
                handleEmployeeChange={this.handleEmployeeChange}
                isEditAppointment={this.state.isEditAppointment}
                notes={this.state.notes}
                start={this.state.startTime}
              />
            </BubbleContainer>
          )}

          {this.state.showEditAppointmentBubble && (
            <BubbleContainer
              submitButtonText="Update"
              title="Edit Appointment"
              toggleBubble={this.toggleEditAppointment}
              handleSubmit={this.handleSubmit}
            >
              <AppointmentWrapper
                employeeId={this.state.employeeId}
                end={this.state.endTime}
                handleChange={this.handleChange}
                handleEmployeeChange={this.handleEmployeeChange}
                isEditAppointment={this.state.isEditAppointment}
                notes={this.state.notes}
                start={this.state.startTime}
                customerName={this.state.customerName}
                employeeName={this.state.employeeName}
                selectedServiceId={this.state.selectedServiceId}
              />
            </BubbleContainer>
          )}
        </main>
        <Toaster
          show={this.state.showToast}
          style={{
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex' }}>
            {this.state.toastMessage}
            <IconClose
              onClick={this.handleToastMessage}
              style={{
                marginLeft: '15px',
                marginTop: '-3px',
              }}
            />
          </div>
        </Toaster>
      </>
    );
  }
}
*/
