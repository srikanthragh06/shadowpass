// Import the main layout and signup logic hook
import MainPage from "../../components/MainPage";
import useSignupPage from "../../hooks/useSignupPage";

/**
 * SignupPage renders the registration form for new users to create an account.
 * It uses the MainPage layout and includes fields for username and master password.
 *
 * @component
 * @returns {JSX.Element} The rendered signup page component.
 */

const SignupPage = () => {
    // Destructure state and handlers from the signup page hook
    const {
        signupFormDetails,
        setSignupFormDetails,
        handleSignup,
        clientSignupError,
        signupMutation,
        signupIsLoading,
    } = useSignupPage();

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
                        value={signupFormDetails.username}
                        onChange={(e) =>
                            setSignupFormDetails({
                                ...signupFormDetails,
                                username: e.target.value,
                            })
                        }
                    />

                    {/* Master Password input field */}
                    <input
                        type="password"
                        id="master-password"
                        placeholder="Master Password"
                        className="input-field max-w-80 w-11/12"
                        value={signupFormDetails.masterPassword}
                        onChange={(e) =>
                            setSignupFormDetails({
                                ...signupFormDetails,
                                masterPassword: e.target.value,
                            })
                        }
                    />

                    {/* Confirm Master Password input field */}
                    <input
                        type="password"
                        id="confirm-master-password"
                        placeholder="Confirm Master Password"
                        className="input-field max-w-80 w-11/12"
                        value={signupFormDetails.confirmMasterPassword}
                        onChange={(e) =>
                            setSignupFormDetails({
                                ...signupFormDetails,
                                confirmMasterPassword: e.target.value,
                            })
                        }
                    />

                    {/* Error message for signup failure from API */}
                    {signupMutation.data?.error && (
                        <p className="text-red-500 text-xs text-center">
                            {signupMutation.data.error}
                        </p>
                    )}
                    {/* Error message for client-side validation */}
                    {clientSignupError && (
                        <p className="text-red-500 text-xs text-center">
                            {clientSignupError}
                        </p>
                    )}
                    {/* Success message after signup */}
                    {signupMutation.data?.data?.message && (
                        <p className="text-green-500 text-xs text-center">
                            Signup successful!
                        </p>
                    )}

                    {/* Signup button, shows loading state if submitting */}
                    <button
                        className="btn-modern mt-4 sm:text-sm text-xs px-3 py-2"
                        onClick={(e) => handleSignup(e)}
                    >
                        {signupIsLoading ? "..." : "Signup"}
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

export default SignupPage;
