import React, { useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { JazzProvider, PasskeyAuthBasicUI, useAcceptInvite } from "jazz-react"
import { BaseAccount, List } from './schema.tsx'
import { createHashRouter, RouterProvider, useNavigate } from 'react-router'
import { apiKey } from './apiKey.ts'
import { co, ID } from 'jazz-tools'
import { JazzInspector } from 'jazz-inspector'

function Router() {
  const router = createHashRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/invite/*",
      element: <AcceptInvite />,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

declare module "jazz-react" {
  interface Register {
    Account: BaseAccount;
  }
}

// Helper Components

function AcceptInvite() {
  const navigate = useNavigate();

  useAcceptInvite({
    invitedObjectSchema: List,
    onAccept: useCallback(
      async (listID: ID<List>) => {
        const list = await List.load(listID, { resolve: { items: { $each: true } } })

        const me = await BaseAccount.getMe().ensureLoaded({
          resolve: {
            root: true
          },
        });

        if (me?.root) {
          const found = me.root.lists?.find((w: co<List | null>) => {
            if (w!.id == listID) {
              return w
            }
          })

          if (!found && list) {
            me.root.lists!.push(list!)
            me.root.currentList = list
          }

          navigate("/")

          return <p>Routing to List - {me.root.currentList?.name}</p>;
        } else {
          return <p>Checking List - {list?.name}</p>;
        }
      },
      [navigate],
    ),
  });

  return <p>Accepting list invite...</p>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JazzProvider
      AccountSchema={BaseAccount}
      sync={{
        peer: `ws://localhost:4200/?key=${apiKey}`,
      }}
    >
      <JazzInspector position="top right" />
      <PasskeyAuthBasicUI appName="Todo">
        <Router />
      </PasskeyAuthBasicUI>
    </JazzProvider>
  </React.StrictMode>,
)
