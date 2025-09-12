import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";
import "./index.css";
import type { JSX } from "react";
import SignupPage from "./pages/signup/SignupPage";
import NotFoundPage from "./pages/notFound/NotFoundPage";

/**
 * The main application component.
 *
 * This component renders the application container, which contains the router.
 */
function App(): JSX.Element {
    /**
     * The router configuration for the application.
     *
     * This array contains objects that define the routes for the application.
     * Each object in the array must contain a "path" property, which is the URL path for the route, and an "element" property, which is the JSX element to render for the route.
     */
    const appRouter: RouteObject[] = [
        {
            /**
             * The route for the welcome page.
             *
             * This route matches the URL path "/" and renders the <WelcomePage /> element.
             */
            path: "/",
            /**
             * The element to render for the welcome page.
             */
            element: <WelcomePage />,
        },
        {
            /**
             * The route for the signup page.
             *
             * This route matches the URL path "/signup" and renders the <SignupPage /> element.
             */
            path: "/signup",
            /**
             * The element to render for the signup page.
             */
            element: <SignupPage />,
        },
        {
            /**
             * The route for the not found page.
             *
             * This route matches any URL path that is not defined in the router configuration and renders the <NotFoundPage /> element.
             */
            path: "/*",
            /**
             * The element to render for the not found page.
             */
            element: <NotFoundPage />,
        },
    ];

    return (
        <div
            /**
             * The styles for the application container.
             *
             * This container has a full width and height, is centered, and has a minimum height of the full screen.
             */
            className="w-full h-full min-h-screen
                        flex flex-col items-center
                        text-base bg-primary-1 text-white"
        >
            <RouterProvider
                /**
                 * The router for the application.
                 *
                 * This component renders the router for the application, which uses the router configuration defined above.
                 */
                router={createBrowserRouter(appRouter)}
            />
        </div>
    );
}

export default App;
