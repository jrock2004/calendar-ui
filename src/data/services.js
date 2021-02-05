let eventGuid = 0;

export const services = [
  {
    id: createEventId(),
    name: 'Facial',
    duration: '30',
  },
  {
    id: createEventId(),
    name: 'Haircut',
    duration: '30',
  },
  {
    id: createEventId(),
    name: 'Manicure',
    duration: '75',
  },
  {
    id: createEventId(),
    name: 'Massage',
    duration: '60',
  },
  {
    id: createEventId(),
    name: 'Trim',
    duration: '15',
  },
];

export function createEventId() {
  return String(eventGuid++);
}
