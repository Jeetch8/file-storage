import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { base_url } from "../../utils/base_url";

const RenameFolderModal = () => {
  const { doFetch: renameFolderFetch } = useFetch({
    url: base_url + `/folder/rename-folder`,
    method: "PATCH",
    authorized: true,
  });

  return <div>RenameFolderModal</div>;
};

export default RenameFolderModal;
