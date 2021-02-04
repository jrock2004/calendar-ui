import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { INITIAL_EVENTS } from './data/events';
import resources from './data/resources';
import resourceContent from './components/ResourceContent';
import BubbleContainer from './components/BubbleContainer';

import './App.css';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resources: resources,
      selectInfo: null,
      showNewAppointmentBubble: false,
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
              title={`New Appointment with ${this.state.selectInfo.resource.title}`}
              toggleBubble={this.toggleNewAppointment}
            >
              Hello
            </BubbleContainer>
          )}
        </main>
      </>
    )
  }
}

export default App;
