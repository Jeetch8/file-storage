const FolderModel = require("../models/folder.model");
const UserModel = require("../models/user.model");
const FileModel = require("../models/file.model");
const { NotFoundError, BadRequestError } = require("../errors");
const fs = require("fs");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, s3Client } = require("../utils/s3Client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const getFolderContent = async (req, res) => {
  const folderId = req.params.id;
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const folder = await FolderModel.findById(folderId)
    .populate("folders")
    .populate("files")
    .populate("path");
  if (!folder) throw new NotFoundError("Folder not found");
  if (folder.name === "root" && folder.parentId === null) {
    folder._doc.path = [{ name: "Home", _id: folderId }];
  } else {
    const temp = folder.path;
    temp[0].name = "Home";
    temp.push({ name: folder.name, _id: folderId });
    folder._doc.path = temp;
  }
  for (let file of folder.files) {
    const command = new GetObjectCommand({
      Bucket: user.s3_bucket_id,
      Key: file.name,
    });
    file._doc.signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
  }
  res.status(200).json({ folder });
};

const deleteFolder = async (req, res) => {
  const { folderId } = req.body;
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  await deleteFolderAndContents(folderId, user._id, user.s3_bucket_id);
  res.status(200).json({ message: "Folder deleted successfully" });
};

const deleteFolderAndContents = async (folderId, userId, s3_bucket_id) => {
  try {
    const folder = await FolderModel.findById(folderId);
    if (!folder) {
      return { error: `Folder with id ${folderId} not found` };
    }
    let totalDeletedSize = 0;
    for (const childFolderId of folder.folders) {
      const { deletedSize } = await deleteFolderAndContents(childFolderId);
      totalDeletedSize += deletedSize;
    }
    const files = await FileModel.find({ parentId: folderId });
    const fileSizes = files.map((file) => file.size);
    totalDeletedSize += fileSizes.reduce((sum, size) => sum + size, 0);
    await FileModel.deleteMany({ parentId: folderId });
    await FolderModel.findByIdAndDelete(folderId);
    const deletionPromises = files.map((file) => {
      const params = {
        Bucket: s3_bucket_id,
        Key: file.s3Key,
      };
      return s3.deleteObject(params).promise();
    });
    await Promise.all(deletionPromises);
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { usedSpace: -totalDeletedSize },
    });
    return {
      success: `Folder with id ${folderId} and its contents deleted`,
      deletedSize: totalDeletedSize,
    };
  } catch (error) {
    return { error: error.message };
  }
};

const createFolder = async (req, res) => {
  const { folderName, parentFolderId } = req.body;
  const userId = req.user.userId;
  // await FolderModel.deleteMany({});
  // await FileModel.deleteMany({});
  // await UserModel.deleteMany({});
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
  const currentPath = [...parentFolder.path, parentFolderId];
  const folder = await FolderModel.create({
    name: folderName,
    path: currentPath,
    parentId: parentFolderId,
    owner_id: userId,
  });
  await FolderModel.findByIdAndUpdate(parentFolderId, {
    $push: { folders: folder._id },
  });
  res.status(201).json({ folder });
};

module.exports = { deleteFolder, getFolderContent, createFolder };
