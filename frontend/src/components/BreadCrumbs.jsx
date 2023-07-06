import React, { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const getPathArray = (path) => {
  return path.split("/");
};

const BreadCrumbs = ({ path }) => {
  const [state, setState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (path !== undefined) {
      const arr = getPathArray(path).slice(1);
      arr[0] = "Home";
      setState(arr);
    }
  }, [path]);

  return (
    <div className="flex items-center gap-x-2 mt-2 ml-4">
      {state.map((el, ind) => {
        return (
          <div className="flex items-center gap-x-2 " key={ind}>
            <button className="px-2 rounded-md py-1 hover:bg-stone-200 text-xl">
              {el}
            </button>
            {ind !== state.length - 1 && <MdArrowRight size={25} />}
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
