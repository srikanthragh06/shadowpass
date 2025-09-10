import type { ReactNode } from "react";

type MainPageProps = {
    children?: ReactNode;
    className?: string;
};

/**
 * The main application page component.
 *
 * This component provides a basic layout for the page, with a
 * vertically-stacked layout for the content.
 *
 * @param {MainPageProps} props - The component props.
 * @param {ReactNode} [props.children] - The content of the page.
 * @param {string} [props.className] - The class name for the component.
 * @returns {JSX.Element} - The component.
 */
const MainPage = ({ children, className = "" }: MainPageProps) => {
    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {children}
        </div>
    );
};

export default MainPage;
