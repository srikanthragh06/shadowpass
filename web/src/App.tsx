import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";

function App() {
    const appRouter: RouteObject[] = [
        {
            path: "/",
            element: <WelcomePage />,
        },
    ];

    return (
        <div
            className="w-full h-full min-h-screen
                        flex flex-col items-center
                        text-3xl bg-black text-white"
        >
            <RouterProvider router={createBrowserRouter(appRouter)} />
        </div>
    );
}

export default App;
