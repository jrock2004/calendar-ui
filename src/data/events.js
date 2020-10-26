let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, '');

export const INITIAL_EVENTS = [
  {
    id: `event-${createEventId()}`,
    // backgroundColor: "#fff",
    resourceId: "resource-1",
    title: "Trim",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:15:00',
    customerId: 'customer-0',
  },
  {
    id: `event-${createEventId()}`,
    // backgroundColor: "#fff",
    resourceId: "resource-2",
    title: "Haircut",
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T10:00:00',
    customerId: 'customer-1',
  },
  {
    id: `event-${createEventId()}`,
    // backgroundColor: "#fff",
    resourceId: "resource-3",
    title: "Haircut",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:30:00',
    customerId: 'customer-2',
  },
]

export function createEventId() {
  return String(eventGuid++)
}
