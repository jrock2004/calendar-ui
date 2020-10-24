import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { INITIAL_EVENTS } from './data/events';
import resources from './data/resources';
import resourceContent from './components/ResourceContent';
import renderEventContent from './components/RenderEventContent';
import NewAppointmentBubble from './components/NewAppointmentBubble';

import './App.css';

function App() {
  const [state, setState] = useState({
    showNewAppointmentBubble: false,
    calendarApi: null,
    selectInfo: null,
  });

  const handleDateClick = (selectInfo) => {
    setState({
      showNewAppointmentBubble: true,
      selectInfo: selectInfo,
    });
  }

  const toggleNewAppointment = () => {
    setState({
      ...state,
      showNewAppointmentBubble: !state.showNewAppointmentBubble
    })
  }

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
          select={handleDateClick}
          eventContent={renderEventContent}
        />
        {state.showNewAppointmentBubble && (
          <NewAppointmentBubble
            selectInfo={state.selectInfo}
            toggleNewAppointment={toggleNewAppointment}
          />
        )}
      </main>
    </>
  );
}

export default App;
