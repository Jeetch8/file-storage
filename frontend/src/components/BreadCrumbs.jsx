import React, { useEffect, useState } from "react";

const getPathArray = (path) => {
  return path.split("/");
};

const BreadCrumbs = ({ path }) => {
  const [state, setState] = useState([]);

  useEffect(() => {
    if (path !== undefined) {
      const arr = getPathArray(path);
      console.log(arr, path);
      setState(arr);
    }
  }, [path]);

  return (
    <div className="flex items-center">
      {state.map((el, ind) => {
        return (
          <div className="flex items-center gap-x-2" key={ind}>
            <p>/</p>
            <p>{el}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
