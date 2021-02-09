import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from '@mbkit/textarea';
import { Label } from '@mbkit/label';
import { IconClose, IconServices, IconCreditCard } from '@mbkit/icon';
import { Button } from '@mbkit/button';

import { InputSuggest } from '../inputSuggest/InputSuggest';
import { UiSelect } from '../UiSelect';
import { GetAppointmentTime } from './GetAppointmentTime';

export const AppointmentWrapper = ({
  clickEventCancel,
  customers,
  employees,
  isEditAppointment,
  selectedEvent,
  services,
  handleChange,
}) => {
  let showAppointmentTime = selectedEvent.end && selectedEvent.start;
  let customer =
    selectedEvent.customerId !== null
      ? customers.find((cs) => +cs.id === +selectedEvent.customerId)
      : null;
  let customerName = customer !== null ? `${customer.firstName} ${customer.lastName}` : '';

  return (
    <div>
      {showAppointmentTime && (
        <GetAppointmentTime end={selectedEvent.end} start={selectedEvent.start} />
      )}

      <InputSuggest
        initialValue={customerName}
        handleClick={handleChange}
        label="Customer Name"
        suggestions={customers}
      />

      <UiSelect
        name="serviceId"
        label="Choose a service"
        value={selectedEvent.serviceId}
        handleChange={handleChange}
      >
        <option>Please select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </UiSelect>

      <UiSelect
        name="employeeId"
        label="Choose a employee"
        value={+selectedEvent.employeeId}
        handleChange={handleChange}
      >
        <option>Please select a employee</option>
        {employees.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.title}
          </option>
        ))}
      </UiSelect>

      <div className="mt-4">
        <Label>
          Appointment Notes
          <Textarea name="notes" value={selectedEvent.notes} onChange={handleChange} />
        </Label>
      </div>

      {isEditAppointment && (
        <div className="mt-8 border-t pt-4">
          <div className="grid grid-flow-col auto-cols-max gap-3">
            <Button variant="tertiaryOutlined" size="4" disabled={true}>
              <IconCreditCard />
              Take Payment
            </Button>
            <Button variant="tertiaryOutlined" size="4" disabled={true}>
              <IconServices />
              Confirm
            </Button>
            <Button variant="tertiaryOutlined" size="4" onClick={clickEventCancel}>
              <IconClose />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

AppointmentWrapper.propTypes = {
  clickEventCancel: PropTypes.func,
  customers: PropTypes.array,
  employees: PropTypes.array,
  handleChange: PropTypes.func,
  isEditAppointment: PropTypes.bool,
  selectedEvent: PropTypes.object,
  services: PropTypes.array,
};

export default AppointmentWrapper;
