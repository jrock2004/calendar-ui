import React, { createRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import addMinutes from 'date-fns/addMinutes';
import { Heading } from '@mbkit/typography';
import { Toaster } from '@mbkit/toaster';
import { IconClose } from '@mbkit/icon';

import { db } from './services/firebase';
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
    status: 1,
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
    else console.error('You do not have a use state for this setup yet');
  }

  let setEventsFromFirebase = (newEvents) => {
    setEvents(newEvents);
  };

  useEffect(() => {
    requestResources('resources');
    requestResources('customers');
    requestResources('services');

    db.ref('events').on('value', (snapshot) => {
      let newEvents = [];

      snapshot.forEach((snap) => {
        newEvents.push({
          id: snap.key,
          ...snap.val(),
        });
      });

      setEventsFromFirebase(newEvents);
    });
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
      status: 1,
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
    let event = events.find((ev) => ev.id === info.event.id);
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
      status: event.extendedProps.status || 1,
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

    let {
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
            status: 1,
          },
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
    let newEvent = event.event.toPlainObject(),
      resourceId = +newEvent.extendedProps.employeeId;

    db.ref('events')
      .push({
        ...newEvent,
        extendedProps: {
          customer: newEvent.extendedProps.customer,
          notes: newEvent.extendedProps.notes,
          status: +newEvent.extendedProps.status,
        },
        resourceId: resourceId,
      })
      .then(() => {
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
        ? +newEvent.extendedProps.employeeId
        : +info.event.getResources()[0].id;

      let updates = {},
        param = `/events/${newEvent.id}`;

      updates[param] = {
        ...newEvent,
        extendedProps: {
          customer: newEvent.extendedProps.customer,
          notes: newEvent.extendedProps.notes,
          status: +newEvent.extendedProps.status,
        },
        resourceId,
      };

      // Delete the firebase id as we do not need it anymore
      delete updates[param].id;

      db.ref()
        .update(updates)
        .then(() => {
          setToast({
            toastMessage: 'Appointment was updated successfully',
            showToast: true,
          });
        });
    }
  };

  let handleEventRemove = (info) => {
    let deleteEvent = info.event,
      param = `/events/${deleteEvent.id}`;

    db.ref(param)
      .remove()
      .then(() => {
        toggleEditAppointment();
        setToast({
          toastMessage: `${deleteEvent.title} appointment has been cancelled`,
          showToast: true,
        });
      });
  };

  let clickEventCancel = (event) => {
    event.preventDefault();

    let currentEvent = calendarRef.current.getApi().getEventById(selectedEvent.eventId);

    currentEvent.remove();
  };

  let handleToastMessage = () => {
    setToast({
      ...toast,
      showToast: false,
    });
  };

  let handleConfirmClick = (ev) => {
    ev.preventDefault();

    let currentEvent = calendarRef.current.getApi().getEventById(selectedEvent.eventId);

    currentEvent.setExtendedProp('status', 2);

    toggleEditAppointment();
  };

  return (
    <div className="h-full grid main-container">
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
          height="100%"
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
              handleConfirmClick={handleConfirmClick}
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
    </div>
  );
};

export default App;
