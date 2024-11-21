import Loader from "./Loader";
const RedirectLoader = () => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div>
          <Loader />
        </div>
      </div>
    );
  };
  
  export default RedirectLoader;
  