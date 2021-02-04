import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import './App.css';
class App extends Component {
  render() {
    return (
      <>
        <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
          <h1 className="text-2xl">Scheduling</h1>
        </header>
        <main className="px-6 pt-4">
          This is cool
        </main>
      </>
    )
  }
}

export default App;
