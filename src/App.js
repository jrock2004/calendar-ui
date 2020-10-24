import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

import './App.css';

function App() {
  const resources = [
    { id: 1, title: 'John', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpickaface.net%2Fgallery%2Favatar%2Funr_sample_161118_2054_ynlrg.png&f=1&nofb=1'},
    { id: 2, title: 'Matt', image: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdemos.microdesign-web.com%2Fsample_admin%2Fassets%2Fimg%2Favatar.jpg&f=1&nofb=1'},
    { id: 3, title: 'Eddie', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpickaface.net%2Fgallery%2Favatar%2FBenjohnsone54fbec7a167c5.png&f=1&nofb=1'}
  ];

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
        />
      </main>
    </>
  );
}

export default App;
