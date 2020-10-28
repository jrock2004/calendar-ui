let eventGuid = 0;

export const customers = [
  {
    id: `customer-${createEventId()}`,
    firstName: 'Han',
    lastName: 'Solo',
    email: 'han.solo@test.com',
    phone: '7165551234'
  },
  {
    id: `customer-${createEventId()}`,
    firstName: 'Luke',
    lastName: 'Skywalker',
    email: 'luke.skywalker@test.com',
    phone: '7165555678'
  },
  {
    id: `customer-${createEventId()}`,
    firstName: 'Emperor',
    lastName: 'Palpatine',
    email: 'emperor.palpatine@test.com',
    phone: '7025559876'
  },
]

export function createEventId() {
  return String(eventGuid++)
}
