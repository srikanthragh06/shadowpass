import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { registerAPI } from "../api/auth";
import { generateMasterToken, generateVaultKey } from "../utils/crypto";
import { setJwtToken } from "../utils/token";

/**
 * Custom hook to manage the signup page logic and state.
 * Handles form state, validation, API calls, and error handling for user registration.
 *
 * @returns {object} - Signup form state, handlers, mutation, and error/loading states.
 */
const useSignupPage = () => {
    const [signupFormDetails, setSignupFormDetails] = useState<{
        username: string;
        masterPassword: string;
        confirmMasterPassword: string;
    }>({
        username: "",
        masterPassword: "",
        confirmMasterPassword: "",
    });

    // Indicates if signup is in progress
    const [signupIsLoading, setSignupIsLoading] = useState(false);

    // Holds client-side validation or API error messages
    const [clientSignupError, setClientSignupError] = useState<string | null>(
        null
    );

    /**
     * React Query mutation for user registration API call.
     * On success, stores JWT token and can redirect user.
     */
    const signupMutation = useMutation<
        any,
        Error,
        { username: string; masterToken: string }
    >({
        mutationFn: ({ username, masterToken }) =>
            registerAPI({ username, masterToken }),
        onSuccess: (data) => {
            if (data?.data?.jwtToken) {
                setJwtToken(data.data.jwtToken);
                // Redirect to dashboard or another page after successful signup
            }
        },
        onSettled: () => setClientSignupError(null),
    });

    /**
     * Handles the signup form submission, including validation and API call.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSignup = async (e: React.FormEvent) => {
        try {
            setSignupIsLoading(true);
            e.preventDefault();

            // Check if passwords match
            if (
                signupFormDetails.masterPassword !==
                signupFormDetails.confirmMasterPassword
            ) {
                setClientSignupError("Passwords do not match");
                return;
            }

            // Check password length
            if (signupFormDetails.masterPassword.length < 8) {
                setClientSignupError(
                    "Master password must be at least 8 characters long"
                );
                return;
            }

            // Generate cryptographic keys for secure signup
            const vaultKey = await generateVaultKey(
                signupFormDetails.username,
                signupFormDetails.masterPassword
            );
            const masterToken = await generateMasterToken(
                vaultKey,
                signupFormDetails.masterPassword
            );
            // Trigger the signup mutation
            signupMutation.mutate({
                username: signupFormDetails.username,
                masterToken,
            });
        } catch (error) {
            setClientSignupError("An error occurred during signup");
        } finally {
            setSignupIsLoading(false);
        }
    };

    // Expose state and handlers for use in the signup page component
    return {
        signupFormDetails, // Form field values
        setSignupFormDetails, // Setter for form fields
        handleSignup, // Form submit handler
        signupMutation, // React Query mutation object
        clientSignupError, // Error message (if any)
        signupIsLoading, // Loading state
    };
};

export default useSignupPage;
