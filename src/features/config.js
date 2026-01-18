const rawUri =
  process.env.REACT_APP_API_URI || "https://publicdripperbackend.vercel.app";
const uri = rawUri.replace(/\/$/, ""); // Remove trailing slash

export default uri;
