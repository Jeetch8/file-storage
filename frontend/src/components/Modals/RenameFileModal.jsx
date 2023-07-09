import React from "react";
import { base_url } from "../../utils/base_url";
import { useFetch } from "../../hooks/useFetch";
import Modal from "./Modal";

const RenameFileModal = () => {
  const { doFetch: renameFileFetch } = useFetch({
    url: base_url + `/file/reanme-file`,
    method: "PATCH",
    authorized: true,
  });

  return <Modal modalContent={<div>test</div>} openModalBtnStyle={"hidden"} />;
};

export default RenameFileModal;
