import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-xl text-gray-700 mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-lg text-gray-500 italic">
        {error.statusText || error.message}
      </p>
      <a
        href="/"
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default ErrorPage;
