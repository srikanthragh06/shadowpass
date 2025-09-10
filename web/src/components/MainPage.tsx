import type { ReactNode } from "react";

type MainPageProps = {
    children?: ReactNode;
    className?: string;
};

const MainPage = ({ children, className = "" }: MainPageProps) => {
    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {children}
        </div>
    );
};

export default MainPage;
