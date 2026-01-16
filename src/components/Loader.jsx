import { FaSpinner } from "react-icons/fa";
import '../assets/loader.css'

function Loader({size}) {
  return <FaSpinner className={`spinner ${size}`} />;
}

export default Loader