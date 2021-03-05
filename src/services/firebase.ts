import { Dispatch, SetStateAction } from 'react';
import firebase from 'firebase';
import { ResourceApi } from '@fullcalendar/resource-common';
import { EventInput } from '@fullcalendar/react';

import { ICustomer, IFirebaseConfig, IServices } from '../interfaces/interfaces';

const config: IFirebaseConfig = {
  apiKey: 'AIzaSyAuaC73OTtBx6S-ChVm0h37pChmFialCUE',
  authDomain: 'scheduling-typescript.firebaseapp.com',
  projectId: 'scheduling-typescript',
  storageBucket: 'scheduling-typescript.appspot.com',
  messagingSenderId: '933707952242',
  appId: '1:933707952242:web:72d1e74eaa8d830ca452eb',
};

firebase.initializeApp(config);

export const db = firebase.database();

export const getResources = (setResourcesFromFirebase: Dispatch<SetStateAction<ResourceApi[]>>) => {
  db.ref('resources').on('value', (snapshot) => {
    let newResources: ResourceApi[] = [];

    snapshot.forEach((snap) => {
      newResources.push({
        id: snap.key,
        ...snap.val(),
      });
    });

    setResourcesFromFirebase(newResources);
  });
};

export const getServices = (setServicesFromFirebase: Dispatch<SetStateAction<IServices[]>>) => {
  db.ref('services').on('value', (snapshot) => {
    let newServices: IServices[] = [];

    snapshot.forEach((snap) => {
      newServices.push({
        id: snap.key,
        ...snap.val(),
      });
    });

    setServicesFromFirebase(newServices);
  });
};

export const getCustomers = (setCustomersFromFirebase: Dispatch<SetStateAction<ICustomer[]>>) => {
  db.ref('customers').on('value', (snapshot) => {
    let newCustomers: ICustomer[] = [];

    snapshot.forEach((snap) => {
      newCustomers.push({
        id: snap.key,
        ...snap.val(),
      });
    });

    setCustomersFromFirebase(newCustomers);
  });
};

export const getEvents = (setEventsFromFirebase: Dispatch<SetStateAction<EventInput[]>>) => {
  db.ref('events').on('value', (snapshot) => {
    let newEvents: EventInput[] = [];

    snapshot.forEach((snap) => {
      newEvents.push({
        id: snap.key,
        ...snap.val(),
      });
    });

    setEventsFromFirebase(newEvents);
  });
};
