import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from '@mbkit/textarea';
import { Label } from '@mbkit/label';
import { IconClose, IconServices, IconCreditCard } from '@mbkit/icon';
import { Button } from '@mbkit/button';

import { customers } from '../../data/customers';
import { resources } from '../../data/resources';
import { services } from '../../data/services';

import { InputSuggest } from '../inputSuggest/InputSuggest';
import { UiSelect } from '../UiSelect';
import { GetAppointmentTime } from './GetAppointmentTime';

export const AppointmentWrapper = ({
  customerName,
  employeeId,
  end,
  isEditAppointment,
  notes,
  selectedServiceId,
  start,
  handleChange,
  handleEmployeeChange,
}) => {
  return (
    <div>
      {start && end && <GetAppointmentTime end={end} start={start} />}

      <InputSuggest
        initialValue={customerName}
        handleClick={handleChange}
        label="Customer Name"
        suggestions={customers}
      />

      <UiSelect
        name="selectedServiceId"
        label="Choose a service"
        value={selectedServiceId}
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
        value={employeeId}
        handleChange={handleEmployeeChange}
      >
        <option>Please select a employee</option>
        {resources.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.title}
          </option>
        ))}
      </UiSelect>

      <div className="mt-4">
        <Label>
          Appointment Notes
          <Textarea name="notes" value={notes} onChange={handleChange} />
        </Label>
      </div>

      {isEditAppointment && (
        <div className="mt-8 border-t pt-4">
          <div className="grid grid-flow-col auto-cols-max gap-3">
            <Button variant="tertiaryOutlined" size="4">
              <IconCreditCard />
              Take Payment
            </Button>
            <Button variant="tertiaryOutlined" size="4">
              <IconServices />
              Confirm
            </Button>
            <Button variant="tertiaryOutlined" size="4">
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
  customerName: PropTypes.string,
  employeeId: PropTypes.string,
  end: PropTypes.instanceOf(Date),
  isEditAppointment: PropTypes.bool,
  notes: PropTypes.string,
  selectedServiceId: PropTypes.string,
  start: PropTypes.instanceOf(Date),
  handleChange: PropTypes.func,
  handleEmployeeChange: PropTypes.func,
};

export default AppointmentWrapper;
