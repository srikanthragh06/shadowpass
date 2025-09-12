import MainPage from "../../components/MainPage";

/**
 * The not found page component.
 *
 * This component renders a message indicating that the page being accessed does not exist.
 *
 * @returns {JSX.Element} - The component.
 */
const NotFoundPage = () => {
    return (
        <MainPage className="items-center justify-center">
            <div className="mt-32 flex flex-col items-center">
                <p>Oops! The page you're looking for doesn't exist.</p>
                <p>Maybe check the URL or head back to the homepage!</p>
            </div>
        </MainPage>
    );
};

export default NotFoundPage;
