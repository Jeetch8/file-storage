const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/full-auth");
const {
  getFolderContent,
  uploadFile,
  createFolder,
} = require("../controllers/files.controller");

router.get("/:id", authenticateUser, getFolderContent);
router.post("/create-folder", authenticateUser, createFolder);
router.post("/upload-file", authenticateUser, uploadFile);

module.exports = router;
