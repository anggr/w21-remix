import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getEnv } from "./env.server";
import store from '../store/store'; // adjust this import path to match your file structure
import { persistStore } from 'redux-persist';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Lyrics",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    ENV: getEnv(),
  });
}

let persistor = persistStore(store);

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Outlet />
          </PersistGate>
        </Provider>
        <ScrollRestoration />

        <LiveReload />
      </body>
    </html>
  );
}
