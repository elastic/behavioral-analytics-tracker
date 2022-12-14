import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createTracker, trackPageView, trackEvent } from "@elastic/behavioral-analytics-javascript-tracker"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

createTracker({
  dsn: "https://my-analytics-dsn.elastic.co"
})

const JavascriptTracker = () => {

  useEffect(() => {
    trackPageView()
  }, [])

  return (
    <div className="App"><span className='click-event' onClick={() => trackEvent("click", { test: "test"}) }>click</span> javascript tracker</div>
  );
};

const BrowserTracker = () => {

  useEffect(() => {
    // @ts-ignore
    window.elasticAnalytics.createTracker();
  }, [])

  return (
    <div className="App"><span className='click-event' onClick={() => {
      // @ts-ignore 
      window.elasticAnalytics.trackEvent("click", { test: "test"}) 
    }}>click</span> browser tracker</div>
  );
};

const router = createBrowserRouter([
  {
    path: "/javascript-tracker",
    element: <JavascriptTracker />,
  },
  {
    path: "/browser-tracker",
    element: <BrowserTracker />,
  },
  {
    path: "/",
    element:  <Navigate to="/javascript-tracker" replace={true} />
  }
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <RouterProvider router={router} />
);

