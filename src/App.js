import React, { createRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import addMinutes from 'date-fns/addMinutes';
import { Heading } from '@mbkit/typography';
import { Toaster } from '@mbkit/toaster';
import { IconClose } from '@mbkit/icon';

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
    showEditAppointmentBubble: false,
    showNewAppointmentBubble: false,
  });
  const [selectedEvent, setSelectedEvent] = useState({
    customerId: null,
    employeeId: null,
    employeeName: '',
    end: null,
    endStr: null,
    notes: '',
    serviceId: null,
    start: null,
    startStr: null,
  });
  const [toast, setToast] = useState({
    showToast: false,
    toastMessage: '',
  });

  // This is for updating to gather all changes before calling the API
  let isUpdatingEvent = false;

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

    console.log(events);
  }, []);

  let resetSelectedEvent = () => {
    setSelectedEvent({
      customerId: null,
      employeeId: null,
      employeeName: '',
      end: null,
      endStr: null,
      eventId: null,
      notes: '',
      serviceId: null,
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
    let event = events.find((ev) => +ev.id === +info.event.id);
    let employee = resources.find((em) => +em.id === +event.resourceId);
    let service = services.find((ser) => ser.name === event.title);

    setSelectedEvent({
      ...selectedEvent,
      customerId: event.extendedProps.customer.id,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      end: new Date(event.end),
      endStr: event.end,
      eventId: event.id,
      notes: event.extendedProps.notes || '',
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
        serviceId: service.id,
      });
    } else if (event && event.target.name === 'employeeId') {
      setSelectedEvent({
        ...selectedEvent,
        [event.target.name]: +event.target.value,
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
      {
        customerId,
        employeeId,
        end,
        endStr,
        eventId,
        notes,
        serviceId,
        start,
        startStr,
      } = selectedEvent,
      calendarApi = calendarRef.current.getApi(),
      newId = +currentEvents.slice(-1)[0].id + 1,
      customer = customers.find((cs) => cs.id === +customerId),
      service = services.find((ser) => ser.id === +serviceId);

    if (bubble.showEditAppointmentBubble) {
      let someEvent = calendarApi.getEventById(eventId);

      isUpdatingEvent = true;
      someEvent.setProp('title', service.name);
      someEvent.setEnd(end);
      someEvent.setStart(start);
      someEvent.setExtendedProp('customer', customer);
      someEvent.setExtendedProp('employeeId', employeeId);

      isUpdatingEvent = false;
      someEvent.setExtendedProp('notes', notes);

      toggleEditAppointment();
    } else {
      calendarApi.addEvent(
        {
          end: endStr,
          extendedProps: {
            customer,
            notes,
          },
          id: +newId,
          employeeId: employeeId,
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
        end: newEvent.end,
        extendedProps: {
          customer: newEvent.extendedProps.customer,
          notes: newEvent.extendedProps.notes,
        },
        id: +newEvent.id,
        resourceId: +newEvent.extendedProps.employeeId,
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
        resetSelectedEvent();

        setToast({
          toastMessage: 'Appointment created successfully',
          showToast: true,
        });
      });
  };

  let handleEventChange = (info) => {
    let newEvent = info.event.toPlainObject();

    if (!isUpdatingEvent) {
      let resourceId = newEvent.extendedProps.employeeId
        ? newEvent.extendedProps.employeeId
        : info.event.getResources()[0].id;

      let eventsArray = events.map((ev) => {
        if (+ev.id === +newEvent.id) {
          return {
            extendedProps: {
              customer: newEvent.extendedProps.customer,
              notes: newEvent.extendedProps.notes,
            },
            end: newEvent.end,
            id: +newEvent.id,
            resourceId: +resourceId,
            start: newEvent.start,
            title: newEvent.title,
          };
        } else {
          return ev;
        }
      });

      fetch(`${HOST}/events.json`, {
        method: 'PUT',
        body: JSON.stringify(eventsArray),
      })
        .then((res) => res.json())
        .then((response) => {
          setEvents(response);
          setToast({
            toastMessage: 'Appointment was updated successfully',
            showToast: true,
          });
        });
    }
  };

  let handleEventRemove = (info) => {
    let deleteEvent = info.event;

    let data = events.filter((ev) => +ev.id !== +deleteEvent.id);

    fetch(`${HOST}/events.json`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(() => {
      toggleEditAppointment();

      setEvents(data);

      setToast({
        toastMessage: `${info.event.title} appointment has been cancelled`,
        showToast: true,
      });
    });
  };

  let clickEventCancel = (event) => {
    event.preventDefault();

    let currentEvent = calendarRef.current.getApi().getEventById(+selectedEvent.eventId);

    currentEvent.remove();
  };

  let handleToastMessage = () => {
    setToast({
      ...toast,
      showToast: false,
    });
  };

  let handleEventDrop = () => {};

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
          eventDrop={handleEventDrop}
          eventRemove={handleEventRemove}
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
              clickEventCancel={clickEventCancel}
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
              clickEventCancel={clickEventCancel}
              handleChange={handleChange}
            />
          </BubbleContainer>
        )}

        <Toaster
          show={toast.showToast}
          style={{
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex' }}>
            {toast.toastMessage}
            <IconClose
              onClick={handleToastMessage}
              style={{
                marginLeft: '15px',
                marginTop: '-3px',
              }}
            />
          </div>
        </Toaster>
      </main>
    </>
  );
};

export default App;
