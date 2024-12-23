// src/components/Contact.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../api/firebase"; // Import app configuration
import { useUserData } from "../context/UserData";
const firestore = getFirestore(app); // Initialize Firestore instance
import { RiMessage2Fill } from "react-icons/ri";
import { RiHome5Fill } from "react-icons/ri";
import { MdContacts } from "react-icons/md";
import toast from "react-hot-toast";

const Contact = () => {
  const { userData } = useUserData(); // Access userData and logout function from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState([]);
  const [msgLength, setMsgLength] = useState(0);
  const [loading, setLoading] = useState(false); // Adding loading state

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  // ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    try {
      // Save form data in Realtime Database under the 'contact' node
      const writeDoc = async () => {
        try {
          // Add a document to the 'users' collection in Firestore
          const docRef = await addDoc(
            collection(firestore, "contactMessages"),
            {
              userId: userData?.id, // Assuming user data is stored in the context
              name: formData.name,
              email: formData.email,
              message: formData.message,
              replay: null,
              read: false,
              timestamp: new Date(),
            }
          );
          console.log("Document written with ID: ", docRef.id);
        } catch (error) {
          console.error("Error adding document: ", error);
          throw error; // Re-throw the error to be caught by the outer try-catch
        }
      };

      await writeDoc(); // Ensure the writeDoc function is awaited

      // Set submission status to false after successful submission
      setSubmitted(false);

      // Reset form data after successful submission
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // Handle any errors that occurred during form submission
      console.error("Form submission failed: ", error);
      // Optionally, set an error state to display an error message to the user
      setError("Failed to submit the form. Please try again.");
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setLoading(false);
    }
  };

  const handlerGet = async () => {
    try {
      try {
        const usersCollection = collection(firestore, "contactMessages"); // Reference to the 'users' collection
        const userQuery = query(
          usersCollection,
          where("userId", "==", userData?.id)
        ); // Query by userId field
        const querySnapshot = await getDocs(userQuery); // Execute query
        const count = querySnapshot.size; // Get the number of documents returned
        setMsgLength(count); // Update the message length state
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            console.log(`Document ID: ${doc.id}, Data:`, doc.data());
            setMsg((prev) => [...prev, doc.data()]); // Add the document data to the message state array
          });
        } else {
          toast.success("No messages found.");
        }
      } catch (error) {
        toast.error(error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    handlerGet();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-12 ">
      <div className="flex justify-between w-full mb-8">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <NavLink to="/">
                <RiHome5Fill /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact">
                <MdContacts /> Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <h1>My Message</h1>
          {msgLength > 0 && (
            <div>
              <label
                htmlFor="my_modal_7"
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                {msgLength}
              </label>
              <input type="checkbox" id="my_modal_7" className="modal-toggle" />
              <div className="modal" role="dialog">
                <div className="modal-box">
                  {msg.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-gray-900"
                    >
                      <h3 className="font-bold text-lg mb-2">Name: {item.name}</h3>
                      <p className="">
                        {" "}
                        <strong>Email:</strong> {item.email}
                      </p>
                      <p className="">
                        {" "}
                        <strong>Message:</strong> {item.message}
                      </p>
                      <p className="">
                        {" "}
                        <strong>Replay:</strong> {item.replay && item.read ? item.replay : "No replay yet"}
                      </p>
                    </div>
                  ))}
                </div>
                <label className="modal-backdrop" htmlFor="my_modal_7">
                  Close
                </label>
              </div>
            </div>
          )}
          <RiMessage2Fill />
        </div>
      </div>
      <h1 className="mb-10 text-center text-5xl font-bold">Contact Us</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Have questions or want to get in touch? Fill out the form below, and
        we’ll get back to you as soon as possible.
      </p>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 border p-5 rounded-md shadow-lg"
      >
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Message Input */}
        <div>
          <label htmlFor="message" className="block mb-1 text-sm font-medium">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="w-full py-2 bg-blue-200 rounded-md hover:bg-blue-300 transition duration-300"
        >
          {loading ? "Sending..." : "Send Message"} {/* Dynamic button text */}
        </button>

        {/* Submission Confirmation */}
        {submitted && (
          <p className="text-green-600 text-center mt-4">
            Thank you! Your message has been sent.
          </p>
        )}
      </form>
    </div>
  );
};

export default Contact;
