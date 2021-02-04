let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, '');

export const INITIAL_EVENTS = [
  {
    id: `event-${createEventId()}`,
    resourceId: "resource-1",
    title: "Trim",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:15:00',
    customer: {
      id: 'customer-0',
      firstName: 'Han',
      lastName: 'Solo',
      email: 'han.solo@test.com',
      phone: '7165551234',
      fullName: 'Han Solo',
    }

  },
  {
    id: `event-${createEventId()}`,
    resourceId: "resource-2",
    title: "Haircut",
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T10:00:00',
    customer: {
      id: 'customer-1',
      firstName: 'Luke',
      lastName: 'Skywalker',
      email: 'luke.skywalker@test.com',
      phone: '7165555678',
      fullName: 'Luke Skywalker',
    }
  },
]

export function createEventId() {
  return String(eventGuid++)
}
