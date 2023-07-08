const router = require("express").Router();

const {
  getFolderContent,
  createFolder,
  deleteFolder,
} = require("../controllers/folder.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/:id", authenticateUser, getFolderContent);
router.post("/create-folder", authenticateUser, createFolder);
router.delete("/", authenticateUser, deleteFolder);

module.exports = router;
