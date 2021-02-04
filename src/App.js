import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { INITIAL_EVENTS } from './data/events';
import resources from './data/resources';
import resourceContent from './components/ResourceContent';
import renderEventContent from './components/RenderEventContent';
import { services } from './data/services';
import NewAppointmentBubble from './components/NewAppointmentBubble';
import EditAppointmentBubble from './components/EditAppointmentBubble';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditAppointmentBubble: false,
      showNewAppointmentBubble: false,
      selectedEvent: null,
      selectInfo: null,
    }

    this.calendarRef = createRef();
  }

  handleDateClick = (selectInfo) => {
    this.setState({
      showNewAppointmentBubble: true,
      selectInfo: selectInfo,
    });
  }

  handleEventClick = ({event}) => {
    let { extendedProps, title } = event,
      { customer } = extendedProps;

    let eventResource = event.getResources()[0];
    let customerName = `${customer.firstName} ${customer.lastName}`;
    let selectedService = services.find(serv => serv.name === title);

    let selectInfo = {
      customer: customer,
      customerName: customerName,
      resourceId: eventResource.id,
      resourceTitle: eventResource.title,
      selectedServiceId: selectedService.id,
    }

    this.setState({
      ...this.state,
      event: event,
      showEditAppointmentBubble: true,
      selectInfo: selectInfo,
    })
  }

  toggleNewAppointment = () => {
    this.setState({
      ...this.state,
      showNewAppointmentBubble: !this.state.showNewAppointmentBubble
    })
  }

  toggleEditAppointment = () => {
    this.setState({
      ...this.state,
      showEditAppointmentBubble: !this.state.showEditAppointmentBubble,
    })
  }

  customButtons = {
    newAppointment: {
      text: 'New Appointment',
      click: (event) => {
        this.toggleNewAppointment();
      }
    }
  }

  headerToolbar = {
    start: 'title',
    center: 'newAppointment',
    end: 'today prev,next',
  }

  render() {
    return (
      <>
        <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
          <h1 className="text-2xl">Scheduling</h1>
        </header>
        <main className="px-6 pt-4">
          <FullCalendar
            plugins={[resourceTimeGridPlugin, interactionPlugin]}
            initialView="resourceTimeGridDay"
            initialEvents={INITIAL_EVENTS}
            allDaySlot={false}
            resources={resources}
            resourceLabelContent={resourceContent}
            slotMinTime="08:00:00"
            slotDuration="00:15:00"
            nowIndicator={true}
            editable={true}
            selectable={true}
            selectConstraint="businessHours"
            select={this.handleDateClick}
            eventContent={renderEventContent}
            customButtons={this.customButtons}
            headerToolbar={this.headerToolbar}
            eventClick={this.handleEventClick}
            ref={this.calendarRef}
          />

          {this.state.showNewAppointmentBubble && (
            <NewAppointmentBubble
              selectInfo={this.state.selectInfo}
              calendarRef={this.calendarRef.current.getApi()}
              toggleNewAppointment={this.toggleNewAppointment}
            />
          )}

          {this.state.showEditAppointmentBubble && (
            <EditAppointmentBubble
              selectInfo={this.state.selectInfo}
              event={this.state.event}
              toggleEditAppointment={this.toggleEditAppointment}
            />
          )}
        </main>
      </>
    )
  }
}

export default App;
