import React, { useEffect, useState } from 'react';
import { ResourceApi } from '@fullcalendar/resource-common';
import { Button } from '@mbkit/button';
import { Card } from '@mbkit/card';
import { IconClose, IconEdit, IconLocation } from '@mbkit/icon';
import { Label } from '@mbkit/label';
import { Select } from '@mbkit/select';
import { Textarea } from '@mbkit/textarea';
import { Text } from '@mbkit/typography';

import styles from './Bubble.module.scss';
import { ICustomer, IServices } from '../../interfaces/interfaces';
import { useCalendar } from '../../customHooks/customHooks';
import { CalendarActions } from '../../Reducers/CalendarReducer';

import { Avatar } from '../Avatar/Avatar';
import { CustomerEventInfo } from '../CustomerEventInfo/CustomerEventInfo';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';

interface Props {
  customers: ICustomer[];
  isEditing: boolean;
  isNewEvent: boolean;
  isOpen: boolean;
  resources: ResourceApi[];
  services: IServices[];
  handleChange: any; // FIXME: Not sure how to fix this to not use any
  handleCheckIn(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  handleEventCancel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  toggleBubble(isNewEvent: boolean, removeEvent: boolean): void;
}

export const Bubble: React.FC<Props> = ({
  customers,
  isEditing,
  isNewEvent,
  isOpen,
  resources,
  services,
  handleChange,
  handleCheckIn,
  handleEventCancel,
  handleSubmit,
  toggleBubble,
}) => {
  const { state, dispatch } = useCalendar();
  const [isEditMode, setIsEditMode] = useState(isNewEvent);

  const setEditMode = (mode: boolean) => {
    setIsEditMode(mode);
  };

  useEffect(() => {
    setEditMode(isNewEvent);
  }, [isNewEvent]);

  let {
    customerId = undefined,
    customerName = '',
    employeeId = undefined,
    employeeName = '',
    notes = '',
    serviceId,
    status,
  } = state.selectedEvent;

  let service = serviceId ? services.find((sv) => +sv.id === +serviceId) : null;

  let handleIconClose = () => {
    setIsEditMode(false);

    if (status === 3) {
      toggleBubble(false, true);
    } else {
      toggleBubble(false, false);
    }
  };

  const toggleEditMode = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    setIsEditMode(!isEditMode);
  };

  const handleNotWorkingButtons = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    console.log('Button is not working yet');
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (state.calendarApi && state.selectedEvent && state.selectedEvent.id) {
      let currentEvent = state.calendarApi.getEventById(state.selectedEvent.id);

      dispatch({ type: CalendarActions.UPDATE_LOCAL_EDITING, payload: true });

      if (currentEvent) {
        currentEvent.setExtendedProp('status', 2);
      }

      toggleBubble(false, false);
    }
  };

  if (isOpen) {
    return (
      <form className={styles.bubble} onSubmit={handleSubmit}>
        <div className={styles.bubbleContainer}>
          <header className={styles.bubbleHeader}>
            <Button
              variant="simpleText"
              className={styles.bubbleHeaderEdit}
              onClick={toggleEditMode}
            >
              <IconEdit width="16px" height="16px" /> {isEditMode ? 'Cancel' : 'Edit'}
            </Button>
            <IconClose
              tabIndex={0}
              role="button"
              className={styles.appointmentBubbleClose}
              onClick={handleIconClose}
            />
          </header>
          <main className={styles.bubbleContent}>
            {!isEditMode && (
              <>
                {service && <CustomerEventInfo customerName={customerName} service={service} />}
                <div className={styles.bubbleRoom}>
                  <IconLocation /> PT Room
                </div>
                <Button
                  variant="secondary"
                  disabled={status === 4}
                  className={styles.bubbleCheckIn}
                  onClick={handleCheckIn}
                >
                  {status !== 4 ? 'Check-in Guest' : 'Already Checked In'}
                </Button>
                <div className={styles.bubbleLinkContainer}>
                  <Button variant="simpleText" onClick={handleEventCancel}>
                    Cancel appointment
                  </Button>
                  {status === 2 ? (
                    <Text as="span">Confirmed</Text>
                  ) : (
                    <Button variant="simpleText" onClick={handleConfirmClick}>
                      Mark as confirmed
                    </Button>
                  )}
                </div>
                <div className={styles.bubbleDivider}>
                  <hr />
                </div>
              </>
            )}
            {isEditMode && (
              <>
                <div className={styles.bubbleField}>
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

                <div className={styles.bubbleField}>
                  <Label id="select-service-label" htmlFor="selectService">
                    Service
                  </Label>
                  <Select
                    id="select-service"
                    name="serviceId"
                    value={serviceId}
                    onChange={handleChange}
                  >
                    <option value="">Select a Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className={styles.bubbleField}>
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
              </>
            )}

            <div>
              <Label id="notes-label" htmlFor="textareaNotes">
                Notes
              </Label>
              <Textarea
                id="textareaNotes"
                className={styles.bubbleNotes}
                name="notes"
                value={notes}
                readOnly={!isEditMode}
                onChange={handleChange}
              />
            </div>
            {!isEditMode && (
              <>
                <div className={styles.bubbleBalancePayments}>
                  <Label id="balance-payment">Balance / Payments</Label>
                  <Text as="span">No payment history</Text>
                </div>
                <div>
                  <Label id="balance-methods">Payment Method</Label>
                  <div className={styles.bubblePaymentMethods}>
                    <Card>
                      <PaymentMethods />
                    </Card>
                  </div>
                  {employeeName && (
                    <div>
                      <Label id="assigned-staff">Assigned Staff</Label>

                      <div className={styles.bubbleEmployeeInfo}>
                        <Avatar />
                        <div>
                          <Button variant="simpleText" onClick={handleNotWorkingButtons}>
                            {employeeName}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
          {isEditMode && (
            <footer className={styles.bubbleFooter}>
              <Button type="submit" variant="primary">
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </footer>
          )}
        </div>
      </form>
    );
  } else {
    return null;
  }
};
