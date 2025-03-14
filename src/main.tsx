import React, { useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { JazzProvider, PasskeyAuthBasicUI, useAcceptInvite } from "jazz-react"
import { LoopAccount, List } from './schema.tsx'
import { createHashRouter, RouterProvider, useNavigate } from 'react-router'
import { apiKey } from './apiKey.ts'
import { co, ID } from 'jazz-tools'

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
    Account: LoopAccount;
  }
}

// Helper Components

function AcceptInvite() {
  const navigate = useNavigate();

  useAcceptInvite({
    invitedObjectSchema: List,
    onAccept: useCallback(
      async (listID: ID<List>) => {
        const list = await List.load(listID, {})

        const me = await LoopAccount.getMe().ensureLoaded({
          root: {},
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
      AccountSchema={LoopAccount}
      sync={{
        peer: `ws://localhost:4200/?key=${apiKey}`,
        when: "signedUp",
      }}
    >
      <PasskeyAuthBasicUI appName="Loop">
        <Router />
      </PasskeyAuthBasicUI>
    </JazzProvider>
  </React.StrictMode>,
)
