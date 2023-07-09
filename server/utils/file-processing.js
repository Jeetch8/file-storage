const FileModel = require("../models/file.model");
const { s3Client } = require("./s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const generateVideoThumbnail = (file, fileId, bucketId) => {
  const thumbnailPath = `${__dirname}/thumbnails/${fileId}.png`;
  ffmpeg(file.tempFilePath)
    .screenshots({
      timestamps: ["00:00:01"],
      filename: thumbnailPath,
      folder: ".",
    })
    .on("end", () => {
      // Upload the thumbnail to S3 and save the URL in the database
      const thumbnailStream = fs.createReadStream(thumbnailPath);
      const thumbnailCommand = new PutObjectCommand({
        Bucket: bucketId,
        Key: `thumbnails/${fileId}.png`,
        Body: thumbnailStream,
      });
      s3Client.send(thumbnailCommand).then(() => {
        fs.promises.unlink(thumbnailPath); // delete the local thumbnail file
        FileModel.findByIdAndUpdate(fileId, {
          thumbnailKey: `thumbnails/${fileId}.png`,
        });
      });
    });
};

const generateLowResImageThumbnail = (file, fileId) => {
  const thumbnailPath = `${__dirname}/thumbnails/${fileId}.png`;
  ffmpeg(file.tempFilePath)
    .outputOptions(["-vf scale=320:-1"])
    .output(thumbnailPath)
    .on("end", () => {
      // Upload the thumbnail to S3 and save the URL in the database
      const thumbnailStream = fs.createReadStream(thumbnailPath);
      const thumbnailCommand = new PutObjectCommand({
        Bucket: bucketId,
        Key: `thumbnails/${fileId}.png`,
        Body: thumbnailStream,
      });
      s3Client.send(thumbnailCommand).then(() => {
        fs.promises.unlink(thumbnailPath); // delete the local thumbnail file
        FileModel.findByIdAndUpdate(fileId, {
          thumbnailKey: `thumbnails/${fileId}.png`,
        });
      });
    });
};

module.exports = { generateVideoThumbnail, generateLowResImageThumbnail };
