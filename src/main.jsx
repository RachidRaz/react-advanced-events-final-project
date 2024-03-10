import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EventProvider } from './api/events';
import { App } from './App';
import EventPage from './pages/EventPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <EventProvider>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/eventpage/:eventId' element={<EventPage />} />

          </Routes>
        </EventProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
