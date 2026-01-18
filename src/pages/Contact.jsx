import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendComment, reset } from "../features/comments/commentSlice";
import Loader from "../components/Loader";
import { FaGem, FaEnvelope } from "react-icons/fa";

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
      toast.success("Message sent successfully");
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
    <div className="min-h-screen bg-noir-900 py-16 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-gold-500 via-gold-400 to-gold-600 rounded-2xl mb-6 shadow-lg shadow-gold-500/30">
            <FaEnvelope className="text-2xl text-noir-900" />
          </div>
          <h1 className="font-display text-4xl font-bold text-champagne-100 mb-3">
            Get in Touch
          </h1>
          <p className="text-champagne-400 max-w-md mx-auto">
            Have questions about our collection or need assistance? Our
            concierge team is here to help.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-5 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                id="name"
                autoComplete="off"
                value={name}
                onChange={onChange}
                required
                className="w-full p-4 bg-noir-700/50 border border-gold-500/20 rounded-xl text-champagne-100 placeholder:text-champagne-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all text-base"
              />
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                id="email"
                autoComplete="off"
                value={email}
                onChange={onChange}
                required
                className="w-full p-4 bg-noir-700/50 border border-gold-500/20 rounded-xl text-champagne-100 placeholder:text-champagne-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all text-base"
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Your Message"
                name="comment"
                id="comment"
                autoComplete="off"
                value={comment}
                onChange={onChange}
                required
                className="w-full p-4 bg-noir-700/50 border border-gold-500/20 rounded-xl text-champagne-100 placeholder:text-champagne-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all text-base resize-vertical min-h-[140px]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold text-lg rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 flex justify-center items-center gap-2 disabled:opacity-60 hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <FaGem className="text-sm" />
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-10 text-center">
          <p className="text-champagne-500 text-sm">
            We typically respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
