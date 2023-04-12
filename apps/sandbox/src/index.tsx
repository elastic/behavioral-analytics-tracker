/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createTracker, trackPageView, trackSearchClick, trackSearch } from "@elastic/behavioral-analytics-javascript-tracker"
import type { BrowserTracker } from "@elastic/behavioral-analytics-browser-tracker"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

declare module window {
  const elasticAnalytics: BrowserTracker
}

createTracker({
  apiKey: "cccc",
  collectionName: "test",
  endpoint: "https://my-browser-analytics-dsn.elastic.co",
})

const JavascriptTracker = () => {

  useEffect(() => {
    trackPageView()
  }, [])

  const trackSearchHandler = () => {
    trackSearch({
      search: {
        "query": "laptop",
        "filters": [ // optional
          {"field": "brand", "value": ["apple"]},
        ],
        page: {  //optional
          current: 1,
          size: 10,
        },
        results: { // optional
          items: [
            {
              document: {
                id: "123",
                index: "products"
              },
              page: {
                url: "http://localhost:3000/javascript-tracker"
              }
            }
          ],
          total_results: 100
        },
        sort: {
          name: "relevance"
        },
        search_application: "website",
      }
    })
  }

  const trackSearchClickHandler = () => {
    trackSearchClick({
      document: { id: "123", index: "products" },
      search: {
        "query": "laptop",
        "filters": [
          {"field": "brand", "value": ["apple"]},
          {"field": "price", "value": ["1000-2000"]},
        ],
        page: {
          current: 1,
          size: 10,
        },
        results: {
          items: [
            
          ],
          total_results: 100
        },
        sort: {
          name: "relevance"
        },
        search_application: "website",
      },
      page: {
        url: "http://localhost:3000/javascript-tracker",
        title: "my product detail"
      }
    })
  }

  return (
    <div className="App">
      <a href="#" className='click-event' onClick={trackSearchClickHandler}>click</a>
     <br/>
     <a href="#" className='search-event' onClick={trackSearchHandler}>search</a>
     <br/>
    javascript tracker</div>
  );
};

const BrowserTrackerView = () => {
  
  useEffect(() => {
    window.elasticAnalytics.createTracker({
      apiKey: "QWtWbGRJY0JDUFVxUmhQTDZKVWk6bzJTVDc0RGJUNFNSMU1RbTUtWmd2dw==",
      collectionName: "test",
      endpoint: "http://localhost:9200",
    });
  }, [])

  return (
    <div className="App">
      <a href="#" className='click-event' onClick={(e) => {
        e.preventDefault();
      window.elasticAnalytics.trackSearchClick({
        document: {
          id: "123",
          index: "products"
        },
        page: {
          url: "http://localhost:3000/javascript-tracker",
          title: "my product detail"
        },
        search: {
          query: "",
          filters: [],
          page: {
            current: 1,
            size: 10
          },
          results: {
            items: [],
            total_results: 10
          },
          sort: {
            name: "relevance"
          },
          search_application: "website"
        }
        })
    }}>document click</a>
          <a href="#" className='search-event' onClick={(e) => {
            e.preventDefault();
      window.elasticAnalytics.trackSearch({
        search: {
          "query": "laptop",
          "filters": [
            {"field": "brand", "value": ["apple"]},
            {"field": "price", "value": ["1000-2000"]},
          ],
          page: {
            current: 1,
            size: 10,
          },
          results: {
            items: [
              {
                document: {
                  id: "123",
                  index: "products"
                },
                page: {
                  url: "http://localhost:3000/javascript-tracker"
                }
              }
            ],
            total_results: 100
          },
          sort: {
            name: "relevance"
          },
          search_application: "website",
        }
      })
    }}>search event</a>
     browser tracker</div>
  );
};

const router = createBrowserRouter([
  {
    path: "/javascript-tracker",
    element: <JavascriptTracker />,
  },
  {
    path: "/browser-tracker",
    element: <BrowserTrackerView />,
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

