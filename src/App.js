import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

import resources from './data/resources';
import './App.css';

function App() {
  // const businessHours = {
  //   startTime: "08:00",
  //   endTime: "17:00"
  // }

  const resourceContent = ({resource}) => {
    const { title, extendedProps} = resource;
    const { image } = extendedProps;

    return (
      <div className="flex items-center py-2">
        <div>
          <img
            src={image}
            alt={title}
            className="w-8 rounded-full mr-3"
          />
        </div>
        <h2>{title}</h2>
      </div>
    )
  }

  return (
    <>
      <header className="mb-4 bg-black text-white px-6 py-4 shadow-lg">
        <h1 className="text-2xl">Scheduling</h1>
      </header>
      <main className="px-6 pt-4">
        <FullCalendar
          plugins={[resourceTimeGridPlugin]}
          initialView="resourceTimeGridDay"
          allDaySlot={false}
          resources={resources}
          resourceLabelContent={resourceContent}
          slotMinTime="08:00:00"
          slotDuration="00:15:00"
          nowIndicator={true}
        />
      </main>
    </>
  );
}

export default App;
