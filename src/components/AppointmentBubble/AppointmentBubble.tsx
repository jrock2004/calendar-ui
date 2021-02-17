import React from 'react';
import { EventInput } from '@fullcalendar/react';
import { ResourceApi } from '@fullcalendar/resource-common';
import { IconClose, IconCreditCard, IconServices } from '@mbkit/icon';
import { Button } from '@mbkit/button';
import { Textarea } from '@mbkit/textarea';
import { Label } from '@mbkit/label';
import { Select } from '@mbkit/select';

import styles from './AppointmentBubble.module.scss';
import { ICustomer, IServices } from '../../interfaces/interfaces';
interface Props {
  buttonText: string;
  customers: ICustomer[];
  isEditing: boolean;
  isOpen: boolean;
  resources: ResourceApi[];
  selectedEvent: EventInput;
  services: IServices[];
  title: string;
  handleChange: any; // FIXME: Not sure how to fix this to not use any
  handleConfirmClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  handleEventCancel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  toggleBubble(isNewEvent: boolean, removeEvent: boolean): void;
}

export const AppointmentBubble: React.FC<Props> = ({
  buttonText,
  customers,
  isEditing,
  isOpen,
  resources,
  selectedEvent,
  services,
  title,
  handleChange,
  handleConfirmClick,
  handleEventCancel,
  handleSubmit,
  toggleBubble,
}) => {
  let classNames = isOpen
    ? `${styles.appointmentBubble} ${styles.appointmentBubbleOpen}`
    : `${styles.appointmentBubble}`;

  let customerId: string =
      selectedEvent.customerId !== null ? selectedEvent.customerId.toString() : '',
    employeeId: string =
      selectedEvent.employeeId !== null ? selectedEvent.employeeId!.toString() : '',
    serviceId: string = selectedEvent.serviceId !== null ? selectedEvent.serviceId.toString() : '',
    status: number = selectedEvent.status;

  let handleIconClose = () => {
    if (status === 3) {
      toggleBubble(false, true);
    } else {
      toggleBubble(false, false);
    }
  };

  return (
    <form className={classNames} onSubmit={handleSubmit}>
      <header className={styles.appointmentBubbleHeader}>
        <span>{title}</span>
        <IconClose
          tabIndex={0}
          role="button"
          className={styles.appointmentBubbleClose}
          onClick={handleIconClose}
        />
      </header>
      <main className={styles.appointmentBubbleMain}>
        <div className={styles.appointmentBubbleMainTop}>
          <div>
            <Label id="select-customer-label" htmlFor="selectCustomer">
              Customer Name
            </Label>
            <Select
              id="select-customer"
              name="customerId"
              value={customerId}
              onChange={handleChange}
            >
              <option value="">Select a Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label id="select-service-label" htmlFor="selectService">
              Service
            </Label>
            <Select id="select-service" name="serviceId" value={serviceId} onChange={handleChange}>
              <option value="">Select a Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label id="select-resource-label" htmlFor="selectResource">
              Select Resource
            </Label>
            <Select
              id="select-resource"
              name="employeeId"
              value={employeeId}
              onChange={handleChange}
            >
              <option value="">Select a Resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label id="notes-label" htmlFor="textareaNotes">
            Appointment Notes
          </Label>
          <Textarea
            id="textareaNotes"
            name="notes"
            value={selectedEvent.notes}
            onChange={handleChange}
          />
        </div>

        {isEditing && (
          <>
            <hr className={styles.appointmentBubbleDivider} />

            <div className={styles.appointmentBubbleActionContainer}>
              <Button variant="tertiaryOutlined" size="4" disabled={true}>
                <IconCreditCard />
                Take Payment
              </Button>
              <Button
                variant="tertiaryOutlined"
                size="4"
                disabled={status !== 1}
                onClick={handleConfirmClick}
              >
                <IconServices />
                Confirm
              </Button>
              <Button variant="tertiaryOutlined" size="4" onClick={handleEventCancel}>
                <IconClose />
                Cancel
              </Button>
            </div>
          </>
        )}
      </main>
      <footer className={styles.appointmentBubbleFooter}>
        <Button type="submit" variant="primary">
          {buttonText}
        </Button>
      </footer>
    </form>
  );
};
