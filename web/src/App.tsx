import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";
import "./index.css";
import type { JSX } from "react";

/**
 * The main application component.
 */
function App(): JSX.Element {
    /**
     * The router configuration for the application.
     */
    const appRouter: RouteObject[] = [
        {
            /**
             * The route for the welcome page.
             */
            path: "/",
            /**
             * The element to render for the welcome page.
             */
            element: <WelcomePage />,
        },
    ];

    return (
        <div
            /**
             * The styles for the application container.
             */
            className="w-full h-full min-h-screen
                        flex flex-col items-center
                        text-base bg-primary-1 text-white"
        >
            <RouterProvider
                /**
                 * The router for the application.
                 */
                router={createBrowserRouter(appRouter)}
            />
        </div>
    );
}

export default App;
