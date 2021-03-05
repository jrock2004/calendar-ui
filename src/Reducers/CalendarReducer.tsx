import { CalendarApi, CalendarOptions } from '@fullcalendar/common';
import { EventInput } from '@fullcalendar/react';

export interface ICalendarState {
  calendarApi: CalendarApi | null;
  calendarOptions: CalendarOptions;
  isLocalEditing: boolean;
  selectedEvent: EventInput;
}

export interface IAction {
  type: string;
  payload?: any;
}

export enum CalendarActions {
  RESET_SELECTED_EVENT = 'RESET_SELECTED_EVENT',
  UPDATE_CALENDAR_API = 'UPDATE_CALENDAR_API',
  UPDATE_CALENDAR_OPTIONS = 'UPDATE_CALENDAR_OPTIONS',
  UPDATE_LOCAL_EDITING = 'UPDATE_LOCAL_EDITING',
  UPDATE_SELECTED_EVENT = 'UPDATE_SELECTED_EVENT',
}

const CalendarReducer = (state: ICalendarState, action: IAction) => {
  switch (action.type) {
    case 'RESET_SELECTED_EVENT': {
      return {
        ...state,
        selectedEvent: initialState,
      };
    }
    case 'UPDATE_CALENDAR_API': {
      if (action.payload && action.payload.calendarApi) {
        return {
          ...state,
          calendarApi: action.payload!.calendarApi,
        };
      } else {
        return state;
      }
    }
    case 'UPDATE_CALENDAR_OPTIONS': {
      let oldCalendarOptions = state.calendarOptions;

      return {
        ...state,
        calendarOptions: {
          ...oldCalendarOptions,
          ...action.payload,
        },
      };
    }
    case 'UPDATE_LOCAL_EDITING': {
      return {
        ...state,
        isLocalEditing: action.payload,
      };
    }
    case 'UPDATE_SELECTED_EVENT': {
      return {
        ...state,
        selectedEvent: {
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export const initialState: ICalendarState = {
  calendarApi: null,
  calendarOptions: {
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
    selectMirror: true,
    slotDuration: '00:15:00',
    slotMaxTime: '20:00:00',
    slotMinTime: '08:00:00',
  },
  isLocalEditing: false,
  selectedEvent: {
    customerId: null,
    customerName: '',
    employeeId: null,
    employeeName: '',
    end: '',
    endStr: '',
    id: '',
    notes: '',
    serviceId: null,
    start: '',
    startStr: '',
    status: 3,
  },
};

export default CalendarReducer;
