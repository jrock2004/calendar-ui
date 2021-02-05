import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import addMinutes from 'date-fns/addMinutes';

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
      resources: resources,
      selectedCustomer: null,
      selectInfo: null,
      selectedEvent: null,
      selectedService: null,
      selectedServiceId: null,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: false,
    };

    this.calendarRef = createRef();
  }

  handleDateClick = (selectInfo) => {
    let { end, resource, start, view } = selectInfo;

    this.setState({
      calendarApi: view.calendar,
      employeeId: resource.id,
      employeeName: resource.title,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: true,
      selectInfo: {
        ...this.state.selectInfo,
        end: end,
        employeeId: resource.id,
        employeeName: resource.title,
        start: start,
      },
    });
  };

  toggleNewAppointment = () => {
    this.setState({
      ...this.state,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: !this.state.showNewAppointmentBubble,
    });
  };

  toggleEditAppointment = () => {
    this.setState({
      ...this.state,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
    });
  };

  handleEventClick = ({ event }) => {
    let { end, extendedProps, start, title } = event,
      { customer } = extendedProps,
      customerName = `${customer.firstName} ${customer.lastName}`,
      selectedService = services.find((serv) => serv.name === title),
      eventResource = event.getResources()[0];

    this.setState({
      ...this.state,
      calendarApi: this.calendarRef,
      customerName: customerName,
      employeeId: eventResource.id,
      employeeName: eventResource.title,
      end: end,
      selectedEvent: event,
      selectedServiceId: selectedService.id,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
      start: start,
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
    } else if (
      event &&
      event.target.name === 'selectedServiceId' &&
      !this.state.calendarApi.current
    ) {
      let service = services.find((serv) => serv.id === event.target.value),
        calendarApi = this.state.calendarApi,
        date = this.state.calendarApi.getDate();

      date.setHours(this.state.selectInfo.start.getHours());
      date.setMinutes(this.state.selectInfo.start.getMinutes());

      let startTime = calendarApi.formatIso(date);
      let endTime = calendarApi.formatIso(addMinutes(date, service.duration));

      this.setState({
        ...this.state,
        [event.target.name]: event.target.value,
        endTime: endTime,
        startTime: startTime,
      });
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
        selectedEvent,
        selectedCustomer,
        selectedServiceId,
        startTime,
      } = this.state,
      service = services.find((serv) => serv.id === selectedServiceId);

    if (selectedEvent) {
      // alert('Currently we only support updating employee and service');
      // selectedEvent.setExtendedProp('customer', {
      //   ...selectedCustomer
      // })
      selectedEvent.setProp('title', service.name);
      selectedEvent.setResources([employeeId]);
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
    }

    this.setState({
      ...this.state,
      calendarApi: null,
      customerName: '',
      employeeId: null,
      employeeName: null,
      selectedCustomer: null,
      selectInfo: null,
      selectedEvent: null,
      selectedService: null,
      selectedServiceId: null,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: false,
    });
  };

  handleEvents = (events) => {
    this.setState({
      ...this.state,
      currentEvents: events,
    });
  };

  render() {
    return (
      <>
        <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
          <h1 className="text-2xl">Scheduling</h1>
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
                start={this.state.startTime}
                customerName={this.state.customerName}
                employeeName={this.state.employeeName}
                selectedServiceId={this.state.selectedServiceId}
              />
            </BubbleContainer>
          )}
        </main>
      </>
    );
  }
}

export default App;
