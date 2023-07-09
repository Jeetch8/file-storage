import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ path }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-x-2 mt-2 ml-4 w-full">
      {path.map((el, ind) => {
        return (
          <div className="flex items-center gap-x-2" key={ind}>
            <button
              className={clsx(
                "px-2 rounded-md py-1 hover:bg-stone-200 text-xl",
                el?.currentFolder && "bg-stone-200"
              )}
              onClick={() => navigate("/folder/" + el._id)}
            >
              {el.name}
            </button>
            {ind !== path.length - 1 && <MdArrowRight size={25} />}
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
