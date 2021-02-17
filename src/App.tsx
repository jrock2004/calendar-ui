import React, { useState } from 'react';
// import interactionPlugin from '@fullcalendar/interaction';
// import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { CalendarOptions } from '@fullcalendar/common';
import { Label } from '@mbkit/label';
import { Select } from '@mbkit/select';
import { Input } from '@mbkit/input';
import { IconListInactive, IconSupport, IconSettings } from '@mbkit/icon';

import './index.scss';
import styles from './App.module.scss';
import logo from './assets/mb-logo-white.png';

import { AppointmentCalendar } from './components/AppointmentCalendar/AppointmentCalendar';

export const App: React.FC = () => {
  const [calendarOptions, setCalendarOption] = useState<CalendarOptions>({
    editable: true,
    eventResourceEditable: true,
    expandRows: true,
    headerToolbar: {
      start: 'today prev next',
      center: '',
      end: 'title',
    },
    height: '100%',
    initialView: 'resourceTimeGridDay',
    nowIndicator: true,
    // plugins: [resourceTimeGridPlugin, interactionPlugin],
    selectable: true,
    selectConstraint: 'businessHours',
    slotDuration: '00:15:00',
    slotMaxTime: '20:00:00',
    slotMinTime: '08:00:00',
  });

  const [slotDuration, setSlotDuration] = useState('00:15:00');
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSlotDurationChange = (element: React.ChangeEvent<HTMLSelectElement>) => {
    let value = element.target.value;

    setCalendarOption({
      ...calendarOptions,
      slotDuration: value,
    });

    setSlotDuration(value);
  };

  let handleToggleSideBar = () => {
    setShowSidebar(!showSidebar);
  };

  let appCssNames = showSidebar ? `${styles.app}` : `${styles.app} ${styles.appNoSide}`;

  return (
    <div className={appCssNames}>
      {showSidebar && (
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <div>
              <img src={logo} className={styles.logo} alt="Mindbody Inc" />
            </div>
          </div>
          <nav className={styles.nav}>
            <a href="#" className={styles.navLink}>
              Dashboard
            </a>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Schedule
            </a>
          </nav>
          <div className={styles.slotDurationContainer}>
            <Label
              htmlFor="slot-duration"
              id="slot-duration-label"
              className={styles.slotDurationLabel}
            >
              Time Duration
            </Label>
            <Select
              className={styles.headerSelect}
              value={slotDuration}
              id="slot-duration"
              onChange={handleSlotDurationChange}
            >
              <option value="00:15:00">15 Min</option>
              <option value="00:30:00">30 Min</option>
              <option value="01:00:00">1 Hr</option>
            </Select>
          </div>
        </header>
      )}
      <main className={styles.main}>
        <header className={styles.mainHeader}>
          <button type="button" className={styles.toggleMenu} onClick={handleToggleSideBar}>
            <IconListInactive />
          </button>
          <div className={styles.mainHeaderRight}>
            <Input
              className={styles.headerSearch}
              disabled={true}
              value=""
              placeholder="Search for clients, tools, data..."
              onChange={(e) => console.log(e.target.value)}
            />
            <IconSupport className={styles.headerIcons} />
            <IconSettings className={styles.headerIcons} />
          </div>
        </header>

        <div className={styles.calendarWrapper}>
          <AppointmentCalendar calendarOptions={calendarOptions} />
        </div>
      </main>
    </div>
  );
};

export default App;
