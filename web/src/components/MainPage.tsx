import type { ReactNode } from "react";
import Navbar from "../pages/navbar/Navbar";

/**
 * Props for the MainPage component.
 * @property {ReactNode} [children] - The content of the page.
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} showNavbar - Whether to display the navigation bar.
 */
type MainPageProps = {
    children?: ReactNode;
    className?: string;
    showNavbar: boolean;
};

/**
 * MainPage provides a basic layout for application pages, including optional navigation.
 *
 * @param {MainPageProps} props - The component props.
 * @returns {JSX.Element} The rendered main page layout.
 */
const MainPage = ({ children, className = "", showNavbar }: MainPageProps) => {
    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {/* Conditionally render the navigation bar if showNavbar is true */}
            {showNavbar && <Navbar />}
            {/* Render the page content */}
            {children}
        </div>
    );
};

export default MainPage;
