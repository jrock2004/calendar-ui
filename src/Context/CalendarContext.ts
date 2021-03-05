import React, { Dispatch } from 'react';
import { ICalendarState, initialState } from '../Reducers/CalendarReducer';

export const CalendarStateContext = React.createContext<ICalendarState>(initialState);
export const CalendarDispatchContext = React.createContext<Dispatch<any>>(() => null);
