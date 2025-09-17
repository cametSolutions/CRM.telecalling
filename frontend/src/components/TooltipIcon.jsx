import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf,
  FaExclamationTriangle,
} from "react-icons/fa";

// Reusable component
const TooltipIcon = ({ icon: Icon, tooltip, to, button = false, className = "" }) => {
  const Wrapper = button ? "button" : Link;
  const props = button ? {} : { to };

  return (
    <Wrapper
      {...props}
      className={`hover:bg-gray-100 text-black font-bold py-2 px-3 rounded inline-flex items-center transition-colors ${className}`}
    >
      <div className="relative group">
        <Icon className="mr-2 cursor-pointer" />
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
                     px-2 py-1 text-xs text-white bg-black rounded 
                     opacity-0 group-hover:opacity-100 transition-opacity 
                     whitespace-nowrap z-10"
        >
          {tooltip}
        </span>
      </div>
    </Wrapper>
  );
};

export default TooltipIcon;
