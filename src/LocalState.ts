import { createContext, useState } from 'react';

const LocalStateContext = createContext({});

const LocalStateProvider = LocalStateContext.Provider;

export { LocalStateContext, LocalStateProvider };
