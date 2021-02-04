import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { INITIAL_EVENTS } from './data/events';
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
      resources: resources,
      selectInfo: null,
      showNewAppointmentBubble: false,
    }

    this.calendarRef = createRef();
  }

  handleDateClick = (selectInfo) => {
    let { end, resource, start, view } = selectInfo;

    this.setState({
      calendarApi: view.calendar,
      showNewAppointmentBubble: true,
      selectInfo: {
        ...this.state.selectInfo,
        end: end,
        employeeId: resource.id,
        employeeName: resource.title,
        start: start,
      }
    });
  }

  toggleNewAppointment = () => {
    this.setState({
      ...this.state,
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: !this.state.showNewAppointmentBubble
    })
  }

  toggleEditAppointment = () => {
    this.setState({
      ...this.state,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
    })
  }

  handleEventClick = ({event}) => {
    let { end, extendedProps, start, title } = event,
      { customer } = extendedProps,
      customerName = `${customer.firstName} ${customer.lastName}`,
      selectedService = services.find(serv => serv.name === title),
      eventResource = event.getResources()[0];

    this.setState({
      ...this.state,
      calendarApi: this.calendarRef,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
      showNewAppointmentBubble: false,
      selectInfo: {
        ...this.state.selectInfo,
        customerName: customerName,
        end: end,
        employeeId: eventResource.id,
        employeeName: eventResource.title,
        selectedServiceId: selectedService.id,
        start: start,
      }
    })
  }

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
              title={`New Appointment with ${this.state.selectInfo.employeeName}`}
              toggleBubble={this.toggleNewAppointment}
            >
              <AppointmentWrapper
                employeeId={this.state.selectInfo.employeeId}
                employeeName={this.state.selectInfo.employeeName}
                end={this.state.selectInfo.end}
                start={this.state.selectInfo.start}
              />
            </BubbleContainer>
          )}

          {this.state.showEditAppointmentBubble && (
            <BubbleContainer
              submitButtonText="Update"
              title="Edit Appointment"
              toggleBubble={this.toggleEditAppointment}
            >
              <AppointmentWrapper
                customerName={this.state.selectInfo.customerName}
                employeeId={this.state.selectInfo.employeeId}
                employeeName={this.state.selectInfo.employeeName}
                end={this.state.selectInfo.end}
                selectedServiceId={this.state.selectInfo.selectedServiceId}
                start={this.state.selectInfo.start}
              />
            </BubbleContainer>
          )}
        </main>
      </>
    )
  }
}

export default App;
