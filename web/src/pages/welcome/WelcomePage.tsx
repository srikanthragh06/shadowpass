import MainPage from "../../components/MainPage";

/**
 * The welcome page component.
 *
 * This component displays a greeting and a login button and a signup button.
 *
 * @returns {JSX.Element} - The component.
 */
const WelcomePage = () => {
    return (
        <MainPage
            className="items-center"
            // The main container for the welcome page.
        >
            <div
                className="mt-24 flex flex-col items-center"
                // The top container for the heading, subtitle, and buttons.
            >
                <div className="sm:text-6xl text-5xl kode-mono-bold">
                    ShadowPass
                </div>
                <p className="mt-1 sm:text-lg text-base">
                    simple, secure, zero knowledge vault{" "}
                </p>
                <div
                    className="flex gap-4 mt-6"
                    // The container for the login and signup buttons.
                >
                    <button className="btn-modern">Login</button>
                    <button className="btn-modern">Sign up</button>
                </div>
            </div>
            <div
                className="text-center
                        md:w-140 sm:w-100 w-full px-3 sm:px-0
                         mt-16
                         md:text-xl text-lg"
                // The container for the description.
            >
                {/* A short description of the project */}
                Welcome to ShadowPass — a simple, easy-to-use, zero-knowledge
                vault for storing passwords and notes. Securely generate,
                organize, and access your data anytime, knowing only you hold
                the key.
            </div>
        </MainPage>
    );
};

export default WelcomePage;
