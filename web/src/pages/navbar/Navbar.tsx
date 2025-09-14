/**
 * Navbar component for the application.
 *
 * Renders a top navigation bar with the app title and a settings link.
 *
 * @component
 * @returns {JSX.Element} The rendered navigation bar.
 */
const Navbar = () => {
    return (
        <div
            className="w-full border-b- bg-gray-900/50 border-gray-800 h-16 
            flex items-center justify-between "
        >
            {/* App title on the left */}
            <div className="sm:text-4xl text-lg kode-mono-bold ml-40">
                shadowPass
            </div>

            {/* Settings link on the right */}
            <div className="flex items-center h-full border-2 mr-20">
                <p className="cursor-pointer">settings</p>
            </div>
        </div>
    );
};

export default Navbar;
