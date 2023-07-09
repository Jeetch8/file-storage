const FolderModel = require("../models/folder.model");
const FileModel = require("../models/file.model");
const fs = require("fs");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3, s3Client } = require("../utils/s3Client");
const UserModel = require("../models/user.model");
const { BadRequestError, NotFoundError } = require("../errors");
const {
  generateVideoThumbnail,
  generateLowResImageThumbnail,
} = require("../utils/file-processing");

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
    throw new BadRequestError("File already exist");
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
  // const fileMimeType = file.mimetype.split("/")[0];
  // if (fileMimeType === "video") {
  //   generateVideoThumbnail(file, newFile._id, user.s3_bucket_id);
  // }
  // if (fileMimeType === "image") {
  //   generateLowResImageThumbnail(file, newFile._id, user.s3_bucket_id);
  // }
  await UserModel.findByIdAndUpdate(userId, {
    $inc: { usedSpace: file.size },
  });
  await FolderModel.findByIdAndUpdate(parentFolderId, {
    $push: { files: newFile._id },
  });
  res.status(201).json({ file: newFile });
};

const deleteFile = async (req, res) => {
  const { fileId } = req.body;
  const userId = req.user.userId;
  if (!fileId) throw new BadRequestError("File id is required");
  const file = await FileModel.findByIdAndDelete(fileId);
  if (!file) throw new NotFoundError("File not found");
  const parentFolder = await FolderModel.findByIdAndUpdate(file.parentId, {
    $pull: { files: fileId },
  });
  const user = await UserModel.findByIdAndUpdate(userId, {
    $inc: { usedSpace: -file.size },
  });
  const command = new DeleteObjectCommand({
    Bucket: user.s3_bucket_id,
    Key: file.name,
  });
  await s3Client.send(command);
  res.status(200).json({ message: "File deleted successfully" });
};

const renameFile = async (req, res) => {
  const userId = req.user.userId;
  const { newFileName } = req.body;
  const { fileId } = req.params;
  const file = await FileModel.findByIdAndUpdate(fileId, { name: newFileName });
  if (!file) throw new BadRequestError("FileId not valid");
  const user = await UserModel.findById(userId);
  await s3
    .copyObject({
      Bucket: user.s3_bucket_id,
      Key: newFileName,
      CopySource: `${user.s3_bucket_id}/${file.name}`,
    })
    .promise();
  await s3
    .deleteObject({ Bucket: user.s3_bucket_id, Key: file.name })
    .promise();
  res.status(200).json({ message: "File renamed successfully" });
};

module.exports = {
  uploadFile,
  deleteFile,
  renameFile,
};
