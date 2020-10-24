let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, '');

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    // backgroundColor: "#fff",
    resourceId: "resource-2",
    title: "Haircut",
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T13:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}
