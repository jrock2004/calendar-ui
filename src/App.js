import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { INITIAL_EVENTS } from './data/events';
import resources from './data/resources';
import resourceContent from './components/ResourceContent';
import renderEventContent from './components/RenderEventContent';
import NewAppointmentBubble from './components/NewAppointmentBubble';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewAppointmentBubble: false,
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

  toggleNewAppointment = () => {
    this.setState({
      ...this.state,
      showNewAppointmentBubble: !this.state.showNewAppointmentBubble
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
            ref={this.calendarRef}
          />

          {this.state.showNewAppointmentBubble && (
            <NewAppointmentBubble
              selectInfo={this.state.selectInfo}
              calendarRef={this.calendarRef.current.getApi()}
              toggleNewAppointment={this.toggleNewAppointment}
            />
          )}
        </main>
      </>
    )
  }
}

export default App;
