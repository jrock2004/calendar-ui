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
    let event = events.find((ev) => +ev.id === +info.event.id);
    let employee = resources.find((em) => +em.id === +event.resourceId);
    let service = services.find((ser) => ser.name === event.title);

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
      someEvent.setExtendedProp('employeeId', employeeId.toString());

      isUpdatingEvent = false;
      someEvent.setExtendedProp('notes', notes);

      toggleEditAppointment();
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

        setToast({
          toastMessage: 'Appointment created successfully',
          showToast: true,
        });
      });
  };

  let handleEventChange = (info) => {
    let newEvent = info.event.toPlainObject();

    if (!isUpdatingEvent) {
      console.log('asdasds');
      const eventsArray = events.map((ev) => {
        if (+ev.id === +newEvent.id) {
          return {
            customer: newEvent.extendedProps.customer,
            end: newEvent.end,
            id: +newEvent.id,
            notes: newEvent.extendedProps.notes,
            resourceId: newEvent.extendedProps.employeeId,
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
    fetch(`${HOST}/events/${info.event.id}.json`, {
      method: 'DELETE',
    }).then(() => {
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

    toggleEditAppointment();
  };

  let handleToastMessage = () => {
    setToast({
      ...toast,
      showToast: false,
    });
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
