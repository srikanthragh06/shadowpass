import MainPage from "../../components/MainPage";
import useLoginPage from "../../hooks/useLoginPage";

/**
 * LoginPage renders the login form for existing users to authenticate.
 * Uses the MainPage layout and the useLoginPage hook for state and logic.
 *
 * @component
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
    // Destructure state and handlers from the login page hook
    const {
        loginFormDetails,
        setLoginFormDetails,
        handleLogin,
        clientLoginError,
        loginMutation,
        loginIsLoading,
    } = useLoginPage();

    return (
        <MainPage className="items-center">
            {/* Login form container */}
            <div
                className="
                    container-modern mt-20 max-w-100 w-5/6"
            >
                {/* App title */}
                <div className="sm:text-5xl text-4xl kode-mono-bold mt-2 mb-10">
                    ShadowPass
                </div>
                {/* Login form */}
                <form className="flex flex-col space-y-4 items-center w-full ">
                    {/* Username input field */}
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="input-field max-w-60 w-11/12"
                        onChange={(e) =>
                            setLoginFormDetails({
                                ...loginFormDetails,
                                username: e.target.value,
                            })
                        }
                    />

                    {/* Master Password input field */}
                    <input
                        type="password"
                        id="master-password"
                        placeholder="Master Password"
                        className="input-field max-w-60 w-11/12"
                        onChange={(e) =>
                            setLoginFormDetails({
                                ...loginFormDetails,
                                masterPassword: e.target.value,
                            })
                        }
                    />

                    {/* Error message for login failure from API */}
                    {loginMutation.data?.error && (
                        <p className="text-red-500 text-xs text-center">
                            {loginMutation.data.error}
                        </p>
                    )}

                    {/* Error message for client-side validation */}
                    {clientLoginError && (
                        <p className="text-red-500 text-xs text-center">
                            {clientLoginError}
                        </p>
                    )}

                    {/* Success message after login */}
                    {loginMutation.data?.data?.message && (
                        <p className="text-green-500 text-xs text-center">
                            Login successful!
                        </p>
                    )}

                    {/* Login button, shows loading state if submitting */}
                    <button
                        className="btn-modern mt-2 sm:text-sm text-xs px-3 py-2"
                        onClick={(e) => handleLogin(e)}
                    >
                        {loginIsLoading ? "..." : "Login"}
                    </button>

                    {/* Link to registration page for new users */}
                    <p className="text-xs text-gray-500 mb-4 mt-6 text-center">
                        Don't have an account yet?{" "}
                        <span className="cursor-pointer hover:text-gray-400 active:text-gray-300 transition">
                            Register here!
                        </span>
                    </p>
                </form>
            </div>
        </MainPage>
    );
};

export default LoginPage;
