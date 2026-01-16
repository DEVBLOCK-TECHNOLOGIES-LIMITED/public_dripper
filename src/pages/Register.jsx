import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  const { user, isError, message, isLoading } = useSelector((state) => {
    return state.auth;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate("/");
    }

    dispatch(reset());
  }, [message, isError, dispatch, user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Password does not Match", { autoClose: 5000 });
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 py-8 px-4 gap-3">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Register</h2>
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            name="name"
            id="name"
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
            value={name}
            placeholder="Enter Name"
            autoComplete="off"
            onChange={onChange}
          />
          <input
            type="email"
            name="email"
            id="email"
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
            value={email}
            placeholder="Enter Email"
            autoComplete="off"
            onChange={onChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
            value={password}
            placeholder="Enter Password"
            autoComplete="off"
            onChange={onChange}
          />
          <input
            type="password"
            name="password2"
            id="password2"
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
            value={password2}
            placeholder="Confirm Password"
            autoComplete="off"
            onChange={onChange}
          />
        </div>
        <button
          type="submit"
          className="p-3 bg-purple-600 text-white font-semibold mt-2 flex justify-center items-center cursor-pointer w-full rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Submit"}
        </button>
        <div className="mt-2 flex justify-center items-center gap-2 text-sm">
          <p>Existing Account?</p>
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
