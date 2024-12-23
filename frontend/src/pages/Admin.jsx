import React, { useEffect, useState } from 'react';
import { fetchAllUsersBlogs } from '../api/userAuth.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const token = localStorage.getItem('token');
  const Navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetchAllUsersBlogs(token);
        if(response.success === false) {
          toast.error(response.message);
          Navigate('/');
        }
        setBlogs(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    if (token) {
      getBlogs();
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, [token]);

  // Conditional rendering based on loading state and errors
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button className="btn loading">Loading...</button>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold text-center mb-6">User Blogs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs?.data?.users?.map((data, index) => (
          <div key={index} className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <img src={data?.profile_picture} alt="Profile" className="rounded-full h-40 w-40 object-cover" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{data?.username}</h2>
              <p>{data?.profile_name}</p>
              <span className="badge badge-primary">{data?.role}</span>
              <p className="text-gray-500">{data?.email}</p>

              <div className="tabs tabs-boxed mt-4">
                <a className="tab ">Blogs</a>
                <a className="tab">Reviews</a>
                <a className="tab">Followers</a>
                <a className="tab">Following</a>
              </div>

              <div className="mt-4">
                {data?.Blogs?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Blogs:</h3>
                    <ul className="list-disc pl-5">
                      {data?.Blogs?.map((blog, index) => (
                        <li key={index}>{blog}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data?.reviews?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Reviews:</h3>
                    <ul className="list-disc pl-5">
                      {data?.reviews?.map((review, index) => (
                        <li key={index}>{review}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data?.followers?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Followers:</h3>
                    <ul className="list-disc pl-5">
                      {data?.followers?.map((follower, index) => (
                        <li key={index}>{follower}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data?.following?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Following:</h3>
                    <ul className="list-disc pl-5">
                      {data?.following?.map((following, index) => (
                        <li key={index}>{following}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
