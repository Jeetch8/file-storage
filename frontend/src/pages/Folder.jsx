import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import ViewFolderContent from "../components/ViewFolderContent";
import { AiOutlineFileAdd } from "react-icons/ai";
import CreateFolderModal from "../components/CreateFolderModal";
import Breadcrumb from "../components/BreadCrumbs";
import toast from "react-hot-toast";

const Folder = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { doFetch, dataRef } = useFetch({
    url: base_url + "/file/" + folderId,
    authorized: true,
    method: "GET",
    onSuccess: (data) => {
      const last = data.folder.path.length - 1;
      data.folder.path[last].currentFolder = true;
    },
    onError: (err) => {
      if (err.message.startsWith("No item found with id")) navigate("/");
    },
  });
  const { doFetch: uploadFileFetch, fetchState: uploadFileState } = useFetch({
    url: base_url + "/file/upload-file",
    authorized: true,
    method: "POST",
    onSuccess: (data) => {
      toast.success("File uploaded successfully");
      doFetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentFolderId", folderId);
    uploadFileFetch(formData);
  };

  useEffect(() => {
    doFetch();
  }, [folderId]);

  return (
    <div>
      {dataRef.current?.folder?.path.length > 0 && (
        <Breadcrumb path={dataRef.current?.folder?.path} />
      )}
      <div className="flex items-center gap-x-3 my-4 mx-4 justify-end">
        <CreateFolderModal parentFolderId={folderId} doFetch={doFetch} />
        <label
          htmlFor="uploadNewFile"
          className="border-2 border-stone-500 rounded-md px-3 py-1 flex items-center gap-x-1 hover:bg-slate-100 cursor-pointer"
        >
          <AiOutlineFileAdd size={22} />
          <span>Upload File</span>
        </label>
        <input
          type="file"
          id="uploadNewFile"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      <ViewFolderContent folderInfo={dataRef.current?.folder} />
    </div>
  );
};

export default Folder;
