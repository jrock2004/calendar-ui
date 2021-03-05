import React, { useReducer, useState } from 'react';
// import interactionPlugin from '@fullcalendar/interaction';
// import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Label } from '@mbkit/label';
import { Select } from '@mbkit/select';
import { Input } from '@mbkit/input';
import { IconListInactive, IconSupport, IconSettings } from '@mbkit/icon';

import './index.scss';
import styles from './App.module.scss';
import logo from './assets/mb-logo-white.png';
import CalendarReducer, { CalendarActions, initialState } from './Reducers/CalendarReducer';
import { CalendarDispatchContext, CalendarStateContext } from './Context/CalendarContext';

import { AppointmentCalendar } from './components/AppointmentCalendar/AppointmentCalendar';

export type Data = {
  routeToLoad?: string;
  token: string;
};

type AppProps = {
  data: Data;
};

export const App = (props: AppProps) => {
  const [state, dispatch] = useReducer(CalendarReducer, initialState);

  console.log('Just testing that the props work', props);

  let appCssNames = `${styles.app}`;

  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <CalendarStateContext.Provider value={state}>
        <div className={appCssNames}>
          <main className={styles.main}>
            <div className={styles.calendarWrapper}>
              <AppointmentCalendar />
            </div>
          </main>
        </div>
      </CalendarStateContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

export default App;
