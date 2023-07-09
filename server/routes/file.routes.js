const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/full-auth");
const {
  uploadFile,
  deleteFile,
  renameFile,
} = require("../controllers/files.controller");

router.post("/upload-file", authenticateUser, uploadFile);
router.delete("/delete-file/", authenticateUser, deleteFile);
router.patch("/rename-file", authenticateUser, renameFile);

module.exports = router;
