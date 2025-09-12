import MainPage from "../../components/MainPage";

// SignupPage renders the registration form for new users to create an account.
// It uses the MainPage layout and includes fields for username and master password.

/**
 * The signup page component.
 *
 * This component renders a form for the user to signup and creates a new account.
 *
 * @returns {JSX.Element} - The component.
 */

const SignupPage = () => {
    // Render the signup form inside the MainPage layout
    return (
        <MainPage className="items-center">
            {/* App title */}
            <div className="sm:text-5xl text-4xl kode-mono-bold mt-16">
                ShadowPass
            </div>

            {/* Signup form container */}
            <div
                className="
                    container-modern mt-10 max-w-120 w-5/6
                    "
            >
                {/* Signup heading */}
                <h1 className="sm:text-base text-sm mb-8">
                    Let's get you registered!
                </h1>

                {/* Registration form */}
                <form className="flex flex-col space-y-3 items-center w-full ">
                    {/* Username input field */}
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="input-field max-w-80 w-11/12"
                    />

                    {/* Master Password input field */}
                    <input
                        type="password"
                        id="master-password"
                        placeholder="Master Password"
                        className="input-field max-w-80 w-11/12"
                    />

                    {/* Confirm Master Password input field */}
                    <input
                        type="password"
                        id="confirm-master-password"
                        placeholder="Confirm Master Password"
                        className="input-field max-w-80 w-11/12"
                    />

                    {/* Signup button */}
                    <button className="btn-modern mt-4 sm:text-sm text-xs px-3 py-2">
                        Signup
                    </button>

                    {/* Link to login page for existing users */}
                    <p className="text-xs text-gray-500 mb-0 mt-2 ">
                        Already have an account?{" "}
                        <span className="cursor-pointer hover:text-gray-400 active:text-gray-300 transition">
                            Login here!
                        </span>
                    </p>
                </form>
            </div>
        </MainPage>
    );
};

// Export the SignupPage component as default
export default SignupPage;
