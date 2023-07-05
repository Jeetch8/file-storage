const { S3Client, S3 } = require("@aws-sdk/client-s3");

const credentials = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials,
});

const s3 = new S3({ credentials, region: "ap-south-1" });

module.exports = { s3Client, s3 };
