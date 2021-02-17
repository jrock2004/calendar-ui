import React, { createRef, useEffect, useState } from 'react';
import FullCalendar, {
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
  EventRemoveArg,
} from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { CalendarOptions } from '@fullcalendar/common';
import { ResourceApi } from '@fullcalendar/resource-common';
import { toMoment } from '@fullcalendar/moment';
import { Toaster } from '@mbkit/toaster';

import styles from './AppointmentCalendar.module.scss';
import { IBubbleOptions, ICustomer, IServices, IToast } from '../../interfaces/interfaces';
import { db, getCustomers, getEvents, getResources, getServices } from '../../services/firebase';

import { Bubble } from '../Bubble/Bubble';
import { FullLoading } from '../FullLoading/FullLoading';
import { RenderEventContent } from '../RenderEventContent/RenderEventContent';
import { ResourceContent } from '../ResourceContent/ResourceContent';

interface Props {
  calendarOptions: CalendarOptions;
}

export const AppointmentCalendar: React.FC<Props> = ({ calendarOptions }) => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [resources, setResources] = useState<ResourceApi[]>([]);
  const [services, setServices] = useState<IServices[]>([]);
  const [bubbleOptions, setBubbleOptions] = useState<IBubbleOptions>({
    isEditing: false,
    isNewEvent: false,
    isOpen: false,
  });
  const [selectedEvent, setSelectedEvent] = useState<EventInput>({
    customerId: null,
    customerName: '',
    employeeId: null,
    employeeName: '',
    end: '',
    endStr: '',
    id: '',
    notes: '',
    serviceId: null,
    start: '',
    startStr: '',
    status: 3,
  });
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [toast, setToast] = useState<IToast>({
    showToast: false,
    toastMessage: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const setResourcesFromFirebase = (newResources: ResourceApi[]) => {
    setResources(newResources);
  };

  const setEventsFromFirebase = (newEvents: EventInput[]) => {
    setEvents(newEvents);
  };

  const setServicesFromFirebase = (services: IServices[]) => {
    setServices(services);
  };

  const setCustomersFromFirebase = (customers: ICustomer[]) => {
    setCustomers(customers);
  };

  let calendarRef = createRef<FullCalendar>(),
    isUpdatingEvent: boolean = false;

  useEffect(() => {
    getResources(setResourcesFromFirebase);
    getServices(setServicesFromFirebase);
    getCustomers(setCustomersFromFirebase);
    getEvents(setEventsFromFirebase);
  }, []);

  let resetSelectedEvent = () => {
    setSelectedEvent({
      customerId: null,
      customerName: '',
      employeeId: null,
      employeeName: '',
      end: '',
      endStr: '',
      id: '',
      notes: '',
      serviceId: null,
      start: '',
      startStr: '',
      status: 3,
    });
  };

  let toggleBubble = (isNewEvent: boolean = true, removeEvent: boolean = false) => {
    let { isOpen } = bubbleOptions;

    if (isOpen) {
      if (removeEvent && !isNewEvent) {
        let param: string = `/events/${selectedEvent.id}`;

        setIsLocalEditing(false);

        db.ref(param).remove();
      }

      resetSelectedEvent();
    }

    setBubbleOptions({
      ...bubbleOptions,
      isEditing: !isNewEvent,
      isNewEvent: isNewEvent,
      isOpen: !bubbleOptions.isOpen,
    });
  };

  let handleDateClick = (selectInfo: DateSelectArg) => {
    let { end, endStr, resource, start, startStr } = selectInfo;

    if (!isLocalEditing) {
      setIsLocalEditing(true);

      let newEvent = {
        ...selectedEvent,
        end,
        endStr,
        employeeId: +resource!.id,
        employeeName: resource!.title,
        start,
        startStr,
      };

      // Setting up ghost appt
      db.ref('events')
        .push({
          end: endStr,
          extendedProps: {
            status: 3,
          },
          resourceId: newEvent.employeeId,
          start: startStr,
        })
        .then((res: any) => {
          setSelectedEvent({
            ...newEvent,
            id: res.getKey(),
          });

          toggleBubble(true, false);
        });
    } else {
      return;
    }
  };

  let handleEventClick = (info: EventClickArg) => {
    let event = events.find((ev) => ev.id === info.event.id);

    if (event && event.extendedProps && event.end) {
      let employee = resources.find((em) => em.id === event!.resourceId);
      let service = services.find((serv) => serv.name === event!.title);
      let customerId = event.extendedProps.customerId;
      let customerName = event.extendedProps.customerName;

      if (employee && service) {
        setSelectedEvent({
          ...setSelectedEvent,
          customerId,
          customerName,
          employeeId: +employee.id,
          employeeName: employee.title,
          end: event.end,
          endStr: event.end.toString(),
          id: event.id?.toString(),
          notes: event.extendedProps.notes,
          serviceId: service.id,
          start: event.start,
          startStr: event.start?.toString(),
          status: event.extendedProps.status,
        });

        toggleBubble(false, false);
      }
    }
  };

  let handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target.name === 'serviceId' && selectedEvent && selectedEvent.start) {
      let service = services.find((serv) => serv.id === +event.target.value),
        calendarApi = calendarRef.current!.getApi(),
        endDate = toMoment(new Date(selectedEvent.start.toString()), calendarApi)
          .add(service!.duration, 'minutes')
          .format();

      setSelectedEvent({
        ...selectedEvent,
        end: endDate,
        endStr: calendarApi.formatIso(endDate),
        serviceId: service!.id,
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

  let handleCalendarLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  let handleEventCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (calendarRef && calendarRef.current && selectedEvent && selectedEvent.id) {
      let currentEvent = calendarRef.current.getApi().getEventById(selectedEvent.id);

      if (currentEvent) {
        setIsLocalEditing(false);
        currentEvent.remove();
      }
    }
  };

  let handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (calendarRef && calendarRef.current && selectedEvent && selectedEvent.id) {
      let currentEvent = calendarRef.current.getApi().getEventById(selectedEvent.id);

      setIsLocalEditing(true);

      if (currentEvent) {
        currentEvent.setExtendedProp('status', 2);
      }

      toggleBubble(false, false);
    }
  };

  let handleCheckIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (calendarRef && calendarRef.current && selectedEvent && selectedEvent.id) {
      let currentEvent = calendarRef.current.getApi().getEventById(selectedEvent.id);

      setIsLocalEditing(true);

      if (currentEvent) {
        currentEvent.setExtendedProp('status', 4);
      }

      toggleBubble(false, false);
    }
  };

  let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLocalEditing(false);

    let { customerId, employeeId, end, id, notes, serviceId, start } = selectedEvent,
      calendarApi = calendarRef.current!.getApi(),
      customer = customers.find((cs) => cs.id === +customerId!),
      service = services.find((ser) => ser.id === +serviceId!);

    if (bubbleOptions.isEditing) {
      if (customer && employeeId && end && id && service && start) {
        let someEvent = calendarApi.getEventById(id);

        if (someEvent && isUpdatingEvent !== null) {
          isUpdatingEvent = true;

          someEvent.setProp('title', service.name);
          someEvent.setEnd(end);
          someEvent.setStart(start);
          someEvent.setExtendedProp('customerId', customer.id);
          someEvent.setExtendedProp('customerName', customer.fullName);
          someEvent.setExtendedProp('employeeId', employeeId);

          isUpdatingEvent = false;
          someEvent.setExtendedProp('notes', notes);

          toggleBubble(false, false);
        }
      }
    } else {
      calendarApi.addEvent(
        {
          end: end,
          extendedProps: {
            customerId: +customer!.id,
            customerName: `${customer?.firstName} ${customer?.lastName}`,
            notes,
            status: 1,
          },
          employeeId: employeeId,
          start: start,
          title: service!.name,
        },
        true
      );

      toggleBubble(true, false);
    }
  };

  let handleEventAdd = (event: EventAddArg) => {
    let newEvent = event.event.toPlainObject(),
      resourceId = +newEvent.extendedProps.employeeId;

    let updates: any = {},
      param = `/events/${selectedEvent.id}`;

    updates[param] = {
      ...newEvent,
      extendedProps: {
        customerId: newEvent.extendedProps.customerId,
        customerName: newEvent.extendedProps.customerName,
        notes: newEvent.extendedProps.notes,
        status: +newEvent.extendedProps.status,
      },
      resourceId,
    };

    db.ref()
      .update(updates)
      .then(() => {
        setToast({
          toastMessage: 'Appointment was created successfully',
          showToast: true,
        });

        setTimeout(() => {
          setToast({
            ...toast,
            showToast: false,
          });
        }, 7000);
      });
  };

  let handleEventChange = (info: EventChangeArg) => {
    let newEvent = info.event.toPlainObject();

    if (!isUpdatingEvent) {
      let resourceId = newEvent.extendedProps.employeeId
        ? +newEvent.extendedProps.employeeId
        : +info.event.getResources()[0].id;

      let updates: any = {},
        param = `/events/${newEvent.id}`;

      updates[param] = {
        ...newEvent,
        extendedProps: {
          customerId: newEvent.extendedProps.customerId,
          customerName: newEvent.extendedProps.customerName,
          notes: newEvent.extendedProps.notes,
          status: newEvent.extendedProps.status,
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

          setTimeout(() => {
            setToast({
              ...toast,
              showToast: false,
            });
          }, 7000);
        });
    }
  };

  let handleEventRemove = (info: EventRemoveArg) => {
    let deleteEvent = info.event,
      param = `/events/${deleteEvent.id}`;

    setIsLocalEditing(false);

    db.ref(param)
      .remove()
      .then(() => {
        toggleBubble(false, false);

        setToast({
          toastMessage: `${deleteEvent.title} appointment has been cancelled`,
          showToast: true,
        });

        setTimeout(() => {
          setToast({
            ...toast,
            showToast: false,
          });
        }, 7000);
      });
  };

  return (
    <div className={styles.appointmentCalendar}>
      <FullCalendar
        allDaySlot={false}
        editable={calendarOptions.editable}
        eventAdd={handleEventAdd}
        eventChange={handleEventChange}
        eventClick={handleEventClick}
        eventContent={RenderEventContent}
        eventRemove={handleEventRemove}
        eventResourceEditable={calendarOptions.eventResourceEditable}
        events={events}
        expandRows={calendarOptions.expandRows}
        height={calendarOptions.height}
        initialView={calendarOptions.initialView}
        loading={handleCalendarLoading}
        nowIndicator={calendarOptions.nowIndicator}
        // plugins={calendarOptions.plugins}
        plugins={[resourceTimeGridPlugin, interactionPlugin]}
        ref={calendarRef}
        resources={resources}
        resourceLabelContent={ResourceContent}
        select={handleDateClick}
        selectable={calendarOptions.selectable}
        selectConstraint={calendarOptions.selectConstraint}
        slotDuration={calendarOptions.slotDuration}
        slotMaxTime={calendarOptions.slotMaxTime}
        slotMinTime={calendarOptions.slotMinTime}
      />

      <Bubble
        customers={customers}
        isEditing={bubbleOptions.isEditing}
        isNewEvent={bubbleOptions.isNewEvent}
        isOpen={bubbleOptions.isOpen}
        resources={resources}
        selectedEvent={selectedEvent}
        services={services}
        handleChange={handleChange}
        handleCheckIn={handleCheckIn}
        handleConfirmClick={handleConfirmClick}
        handleEventCancel={handleEventCancel}
        handleSubmit={handleSubmit}
        toggleBubble={toggleBubble}
      />

      <Toaster
        show={toast.showToast}
        style={{
          zIndex: 1000,
        }}
      >
        {toast.toastMessage}
      </Toaster>

      {isLoading && <FullLoading />}
    </div>
  );
};
