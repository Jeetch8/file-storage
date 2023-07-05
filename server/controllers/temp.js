const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, s3Client } = require("../utils/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { BadRequestError } = require("../errors");
const fs = require("fs");
const FolderModel = require("../models/folder.model");
const FileModel = require("../models/file.model");

function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: "file-storage-service01",
    Key: key,
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

// async () => {
//   console.log(await getObjectUrl("test/photo-1575936123452-b67c3203c357.avif"));
//   // const data = await client.listBuckets();
//   // const image = await getSignedUrl({config:})
//   // s3://file-storage-service01/test/photo-1575936123452-b67c3203c357.avif
// };

const getAllUserFolderAndFiles = async (req, res) => {
  const userId = req.user?.userId;
  const folderId = req.params.folderId;
  const folder = await FolderModel.findById(folderId)
    .populate("parentId")
    .populate({ path: "folders", populate: { path: "parentId" } })
    .populate("files");
  res.status(200).json({ folder });
};

const createNewFolder = async (req, res) => {
  const userId = req.user?.userId;
  const { folder_name, folder_path } = req.body;
  const result = await s3.putObject({
    Bucket: userId,
    Key: folder_path + folder_name + "/",
    Body: "",
  });
  res.status(200).json({ result });
};

const getPathContents = async (req, res) => {
  const userId = req.user?.userId;
  const { path } = req.body;
  const folders = await FolderModel.find({ path: path });
  const files = await FileModel.find({ path });
  res.status(200).json({ result });
};

const updaloadNewFile = async (req, res) => {
  const userId = req.user?.userId;
  const { file_name, file_path } = req.body;
  const file = req?.files?.file;
  if (!file) throw new BadRequestError("File should be provided");
  const filestream = fs.createReadStream(file);
  const command = new PutObjectCommand({
    Bucket: userId,
    Key: file_path + file_name,
    Body: filestream,
  });
  const response = await s3Client.send(command);
  res.status(200).json({ response });
};

module.exports = {
  getAllUserFolderAndFiles,
  createNewFolder,
  updaloadNewFile,
  getPathContents,
};
