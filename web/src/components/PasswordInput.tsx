import { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

/**
 * Props for the PasswordInput component.
 * @property {string} value - The current value of the input field.
 * @property {(value: string) => void} onChange - Handler for input value changes.
 * @property {string} [placeholder] - Optional placeholder text for the input.
 * @property {string} [className] - Optional additional class names for styling.
 */
type PasswordInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

/**
 * PasswordInput is a reusable input component for password fields with show/hide toggle.
 *
 * @component
 * @param {PasswordInputProps} props - The props for the component.
 * @returns {JSX.Element} The rendered password input field with visibility toggle.
 */
const PasswordInput = ({
    className = "",
    value,
    onChange,
    placeholder = "Password",
}: PasswordInputProps) => {
    // State to control password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggle the password visibility
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={`relative max-w-60 w-11/12 ${className}`}>
            {/* Password input field with dynamic type */}
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field w-full pr-10"
            />
            {/* Toggle button for showing/hiding password */}
            <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
                {showPassword ? (
                    <FaEyeSlash size={20} />
                ) : (
                    <IoEyeSharp size={20} />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
