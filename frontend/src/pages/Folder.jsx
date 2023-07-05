import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import ViewFolderContent from "../components/ViewFolderContent";
import { AiOutlineFolderAdd, AiOutlineFileAdd } from "react-icons/ai";

const Folder = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { doFetch, dataRef } = useFetch({
    url: base_url + "/file/" + folderId,
    authorized: true,
    method: "GET",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      if (err.message.startsWith("No item found with id")) navigate("/");
    },
  });

  useEffect(() => {
    doFetch();
  }, [folderId]);

  return (
    <div>
      <div className="flex items-center gap-x-3 my-4 mx-4 justify-end">
        <button className="border-2 border-stone-500 rounded-md px-3 py-1 flex items-center gap-x-1 hover:bg-slate-100">
          <AiOutlineFolderAdd size={26} />
          <span>Add Folder</span>
        </button>
        <button className="border-2 border-stone-500 rounded-md px-3 py-1 flex items-center gap-x-1 hover:bg-slate-100">
          <AiOutlineFileAdd size={22} />
          <span>Add Folder</span>
        </button>
      </div>
      <ViewFolderContent folderInfo={dataRef.current?.folder} />
    </div>
  );
};

export default Folder;
