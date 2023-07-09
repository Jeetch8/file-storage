const router = require("express").Router();

const {
  getFolderContent,
  createFolder,
  deleteFolder,
  renameFolder,
} = require("../controllers/folder.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/:id", authenticateUser, getFolderContent);
router.post("/create-folder", authenticateUser, createFolder);
router.delete("/", authenticateUser, deleteFolder);
router.patch("/rename-folder", authenticateUser, renameFolder);

module.exports = router;
