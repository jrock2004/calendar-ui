import { useContext } from 'react';

import { CalendarDispatchContext, CalendarStateContext } from '../Context/CalendarContext';

export function useCalendar() {
  const dispatch = useContext(CalendarDispatchContext);
  const state = useContext(CalendarStateContext);

  return {
    dispatch,
    state,
  };
}
