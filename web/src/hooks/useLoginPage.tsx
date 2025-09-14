import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { loginAPI } from "../api/auth";
import { generateMasterToken, generateVaultKey } from "../utils/crypto";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to manage the login page logic and state.
 * Handles form state, authentication, API calls, and error handling for user login.
 *
 * @returns {object} - Login form state, handlers, mutation, and error/loading states.
 */
const useLoginPage = () => {
    const navigate = useNavigate();

    // State for login form fields
    const [loginFormDetails, setLoginFormDetails] = useState<{
        username: string;
        masterPassword: string;
    }>({
        username: "",
        masterPassword: "",
    });

    // Indicates if login is in progress
    const [loginIsLoading, setLoginIsLoading] = useState(false);

    // Holds client-side or API error messages
    const [clientLoginError, setClientLoginError] = useState<string | null>(
        null
    );

    /**
     * React Query mutation for user login API call.
     * On success, stores JWT token and can redirect user.
     */
    const loginMutation = useMutation<
        any,
        Error,
        { username: string; masterToken: string }
    >({
        mutationFn: ({ username, masterToken }) =>
            loginAPI({ username, masterToken }),
        onSuccess: (data) => {
            if (data?.data?.message) {
                // Redirect to dashboard
                navigate("/dashboard");
            }
        },
        onSettled: () => setClientLoginError(null),
    });

    /**
     * Handles the login form submission, including key derivation and API call.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleLogin = async (e: React.FormEvent) => {
        try {
            setLoginIsLoading(true);
            e.preventDefault();

            // Generate cryptographic keys for secure login
            const vaultKey = await generateVaultKey(
                loginFormDetails.username,
                loginFormDetails.masterPassword
            );
            const masterToken = await generateMasterToken(
                vaultKey,
                loginFormDetails.masterPassword
            );
            // Trigger the login mutation
            loginMutation.mutate({
                username: loginFormDetails.username,
                masterToken,
            });
        } catch (error) {
            setClientLoginError("An error occurred during login");
        } finally {
            setLoginIsLoading(false);
        }
    };

    // Expose state and handlers for use in the login page component
    return {
        loginFormDetails, // Form field values
        setLoginFormDetails, // Setter for form fields
        handleLogin, // Form submit handler
        loginMutation, // React Query mutation object
        clientLoginError, // Error message (if any)
        loginIsLoading, // Loading state
    };
};

export default useLoginPage;
