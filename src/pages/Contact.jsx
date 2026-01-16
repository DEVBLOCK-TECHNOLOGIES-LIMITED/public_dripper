import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendComment, reset } from "../features/comments/commentSlice";
import Loader from "../components/Loader";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const dispatch = useDispatch();

  const { name, email, comment } = formData;
  const { isError, isLoading, isSuccess, message } = useSelector((state) => {
    return state.comment;
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("comment sent");
      setFormData({
        name: "",
        email: "",
        comment: "",
      });
    }

    dispatch(reset());
  }, [isError, message, dispatch, isSuccess]);

  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(sendComment(formData));
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Name"
            name="name"
            id="name"
            autoComplete="off"
            value={name}
            onChange={onChange}
            required
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            autoComplete="off"
            value={email}
            onChange={onChange}
            required
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
          />
          <textarea
            placeholder="Comment"
            name="comment"
            id="comment"
            autoComplete="off"
            value={comment}
            onChange={onChange}
            required
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base resize-vertical min-h-[120px]"
          />
        </div>
        <button
          type="submit"
          className="p-3 bg-purple-600 text-white font-semibold mt-2 flex justify-center items-center cursor-pointer w-full rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Send"}
        </button>
      </form>
    </div>
  );
}

export default Contact;
