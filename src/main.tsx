import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { WagmiConfig, createConfig } from "wagmi"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import ErrorPage from "./Screens/ErrorPage.tsx"
import Dashboard from "./Screens/Dashboard/Dashboard.tsx"
import Feed from "./Screens/Dashboard/Feed/Feed.tsx"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard/feed",
        element: <Feed />,
      },
    ],
  },
])
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: import.meta.env.VITE_ALCHEMY_ID, // or infuraId
    walletConnectProjectId: import.meta.env
      .VITE_WALLETCONNECT_PROJECT_ID as string,

    // Required
    appName: "ethindia",
  })
)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider theme='retro'>
        <RouterProvider router={router} />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
