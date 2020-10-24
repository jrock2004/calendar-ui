let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, '');

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    // backgroundColor: "#fff",
    resourceId: "resource-2",
    title: "Trim",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:15:00',
    customer: {
      fullName: 'Luke Skywalker'
    }
  },
  {
    id: createEventId(),
    // backgroundColor: "#fff",
    resourceId: "resource-1",
    title: "Haircut",
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T10:00:00',
    customer: {
      fullName: 'Han Solo'
    }
  },
  {
    id: createEventId(),
    // backgroundColor: "#fff",
    resourceId: "resource-3",
    title: "Haircut",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T12:30:00',
    customer: {
      fullName: 'Emperor Palpatine'
    }
  },
]

export function createEventId() {
  return String(eventGuid++)
}
