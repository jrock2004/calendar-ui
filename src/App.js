import React, { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import addMinutes from 'date-fns/addMinutes';
import { Heading } from '@mbkit/typography';
import { Toaster } from '@mbkit/toaster';
import { IconClose } from '@mbkit/icon';

import { createEventId, INITIAL_EVENTS } from './data/events';
import resources from './data/resources';
import { services } from './data/services';

import renderEventContent from './components/RenderEventContent';
import resourceContent from './components/ResourceContent';
import BubbleContainer from './components/BubbleContainer';
import AppointmentWrapper from './components/AppointmentBubble/AppointmentWrapper';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarApi: null,
      currentEvents: [],
      customerName: '',
      employeeId: null,
      employeeName: null,
      endTime: null,
      isEditAppointment: false,
      notes: '',
      resources: resources,
      selectedCustomer: null,
      selectInfo: null,
      selectedEvent: null,
      selectedService: null,
      selectedServiceId: null,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: false,
      showToast: false,
      startTime: null,
      toastMessage: '',
    };

    this.calendarRef = createRef();
  }

  handleDateClick = (selectInfo) => {
    let { end, resource, start, view } = selectInfo;

    this.setState({
      calendarApi: view.calendar,
      employeeId: resource.id,
      employeeName: resource.title,
      endTime: end,
      isEditAppointment: false,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: true,
      startTime: start,
    });
  };

  toggleNewAppointment = () => {
    this.setState({
      ...this.state,
      notes: '',
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: !this.state.showNewAppointmentBubble,
    });
  };

  toggleEditAppointment = () => {
    this.setState({
      ...this.state,
      notes: '',
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
    });
  };

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

  handleEmployeeChange = (event) => {
    const value = event.target.value;
    const resource = resources.find((res) => res.id === value);

    this.setState({
      ...this.state,
      employeeId: resource.id,
      employeeName: resource.title,
    });
  };

  handleChange = (event) => {
    if (event && event.lastName) {
      let name = `${event.firstName} ${event.lastName}`;

      this.setState({
        ...this.state,
        customerName: name,
        selectedCustomer: event,
      });
    } else if (event && event.target.name === 'selectedServiceId') {
      let service = services.find((serv) => serv.id === event.target.value),
        // calendarApi = this.calendarRef.current.getApi(),
        date = this.state.startTime;

      if (service) {
        let startTime = new Date(date.setHours(this.state.startTime.getHours()));
        let endTime = new Date(date.setMinutes(this.state.startTime.getMinutes()));

        endTime = addMinutes(endTime, service.duration);

        this.setState({
          ...this.state,
          [event.target.name]: event.target.value,
          endTime: endTime,
          startTime: startTime,
        });
      } else {
        alert('Known Bug');
      }
    } else {
      this.setState({
        ...this.state,
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSubmit = (ev) => {
    ev.preventDefault();

    let {
        calendarApi,
        customerName,
        employeeId,
        endTime,
        notes,
        selectedEvent,
        selectedCustomer,
        selectedServiceId,
        startTime,
      } = this.state,
      service = services.find((serv) => serv.id === selectedServiceId),
      toastMessage = 'Appointment updated successfully';

    if (selectedEvent) {
      // alert('Currently we only support updating employee and service');
      // selectedEvent.setExtendedProp('customer', {
      //   ...selectedCustomer
      // })
      selectedEvent.setProp('title', service.name);
      selectedEvent.setResources([employeeId]);
      selectedEvent.setExtendedProp('notes', notes);
    } else {
      calendarApi.unselect();

      calendarApi.addEvent({
        id: createEventId(),
        title: service.name,
        start: startTime,
        end: endTime,
        resourceId: employeeId,
        customer: {
          ...selectedCustomer,
          fullName: customerName,
        },
      });

      toastMessage = 'Appointment created successfully';
    }

    this.setState({
      ...this.state,
      calendarApi: null,
      customerName: '',
      employeeId: null,
      employeeName: null,
      isEditAppointment: false,
      notes: '',
      selectedCustomer: null,
      selectInfo: null,
      selectedEvent: null,
      selectedService: null,
      selectedServiceId: null,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: false,
      showToast: true,
      toastMessage: toastMessage,
    });
  };

  handleEvents = (events) => {
    this.setState({
      ...this.state,
      currentEvents: events,
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

export default App;
