import React, { useEffect, useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";

const MoreOptions = ({ options, onClick, entity }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <span className="relative" ref={optionsRef}>
      <button
        className="hover:bg-zinc-100 rounded-full cursor-pointer"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <IoMdMore size={20} />
      </button>
      {showOptions && (
        <ul className="w-[150px] border-2 border-slate-300 absolute rounded-md z-50 bg-white right-0 top-0">
          {options.map((option, index) => {
            return (
              <li
                key={index}
                className="break-keep-all px-2 py-1 hover:bg-slate-100 cursor-pointer"
                onClick={() => onClick(option, entity)}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
};

export default MoreOptions;
