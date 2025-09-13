import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <RecoilRoot>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </RecoilRoot>
);
