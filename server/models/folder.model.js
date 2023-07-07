const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    path: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: true,
      },
    ],
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
