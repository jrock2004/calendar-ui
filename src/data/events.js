import { format } from 'date-fns';

let eventGuid = 0;
let todayStr = format(new Date(), 'yyyy-MM-dd');

export const INITIAL_EVENTS = [
  {
    id: `event-${createEventId()}`,
    resourceId: 'resource-1',
    title: 'Trim',
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:15:00',
    customer: {
      id: 'customer-0',
      firstName: 'Han',
      lastName: 'Solo',
      email: 'han.solo@test.com',
      phone: '7165551234',
      fullName: 'Han Solo',
    },
  },
  {
    id: `event-${createEventId()}`,
    resourceId: 'resource-2',
    title: 'Massage',
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T10:00:00',
    customer: {
      id: 'customer-1',
      firstName: 'Luke',
      lastName: 'Skywalker',
      email: 'luke.skywalker@test.com',
      phone: '7165555678',
      fullName: 'Luke Skywalker',
    },
  },
  {
    id: `event-${createEventId()}`,
    resourceId: 'resource-3',
    title: 'Haircut',
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:30:00',
    customer: {
      id: 'customer-2',
      firstName: 'Emperor',
      lastName: 'Palpatine',
      email: 'emperor.palpatine@test.com',
      phone: '7025559876',
      fullName: 'Emperor Palpatine',
    },
  },
];

export function createEventId() {
  return String(eventGuid++);
}
