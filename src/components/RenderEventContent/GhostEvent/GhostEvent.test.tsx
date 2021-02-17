import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { GhostEvent } from './GhostEvent';

describe('Ghost Event Bubble', () => {
  it('should display title and time', async () => {
    const { getByTestId } = render(<GhostEvent timeText="9:00 - 10:00" />);

    expect(getByTestId('ghostAppointment').textContent).toBe('Ghost Appointment9:00 - 10:00');
  });
});
