const FolderModel = require("../models/folder.model");
const FileModel = require("../models/file.model");
const fs = require("fs");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, s3Client } = require("../utils/s3Client");
const UserModel = require("../models/user.model");
const { BadRequestError } = require("../errors");

const getFolderContent = async (req, res) => {
  const folderId = req.params.id;
  const folder = await FolderModel.findById(folderId)
    .populate("folders")
    .populate("files");
  res.status(200).json({ folder });
};

const createFolder = async (req, res) => {
  const { folderName, parentFolderId } = req.body;
  const userId = req.user.userId;
  if (!folderName) {
    throw new BadRequestError("Name is required");
  }
  if (!parentFolderId) {
    throw new BadRequestError("Parent folder is required");
  }
  const parentFolder = await FolderModel.findById(parentFolderId).populate(
    "folders"
  );
  if (!parentFolder) {
    throw new BadRequestError("Parent folder does not exist");
  }
  parentFolder.folders.forEach((folder) => {
    if (folder.name === folderName) {
      throw new BadRequestError("Folder with this name already exist");
    }
  });
  const path = `${parentFolder.path}/${folderName}`;
  const folder = await FolderModel.create({
    name: folderName,
    parentId: parentFolderId,
    path,
    owner_id: userId,
  });
  await FolderModel.findByIdAndUpdate(parentFolderId, {
    $push: { folders: folder._id },
  });
  res.status(201).json({ folder });
};

const uploadFile = async (req, res) => {
  const file = req?.files?.file;
  const userId = req.user.userId;
  const { parentFolderId } = req.body;
  const user = await UserModel.findById(userId);
  const fileExist = await FileModel.findOne({
    name: file.name,
    parentId: parentFolderId,
  });
  if (fileExist) {
    throw new BadRequestError("File with this name already exist");
  }
  const filestream = fs.createReadStream(file.tempFilePath);
  const command = new PutObjectCommand({
    Bucket: user.s3_bucket_id,
    Key: file.name,
    Body: filestream,
  });
  await s3Client.send(command);
  await fs.promises.unlink(file.tempFilePath);
  const newFile = await FileModel.create({
    name: file.name,
    size: file.size,
    mimeType: file.mimetype,
    parentId: parentFolderId,
    owner_id: userId,
    s3Key: file.name,
  });
  await UserModel.findByIdAndUpdate(userId, {
    $inc: { usedSpace: file.size },
  });
  await FolderModel.findByIdAndUpdate(parentFolderId, {
    $push: { files: newFile._id },
  });
  res.status(201).json({ file: newFile });
};

module.exports = {
  getFolderContent,
  createFolder,
  uploadFile,
};
