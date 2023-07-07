const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser } = require("../utils/createTokenUser");
const { createJWT } = require("../utils/jwt");
const { s3Client, s3 } = require("../utils/s3Client");
const { generate_url_cuid } = require("../utils/cuid_generator");
const FolderModel = require("../models/folder.model");
const FileModel = require("../models/file.model");

const register = async (req, res) => {
  const { email, name, password, profile_img } = req.body;
  await FileModel.deleteMany({});
  await FolderModel.deleteMany({});
  await User.deleteMany({});
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const cuid = generate_url_cuid();
  const user = await User.create({
    name,
    email,
    password,
    profile_img:
      profile_img ??
      "https://img.freepik.com/free-photo/front-view-smiley-man-posing_23-2149512425.jpg?t=st=1714830185~exp=1714833785~hmac=2635937dc1cbed1751ca8b868149828f596ccb61216957cb72bbc0887fff2421&w=1380",
    s3_bucket_id: cuid,
  });
  await s3.createBucket({
    Bucket: cuid,
    CreateBucketConfiguration: {
      LocationConstraint: "ap-south-1",
    },
  });
  const rootfolder = await FolderModel.create({
    name: "root",
    path: [],
    owner_id: user._id,
    parentId: null,
  });
  await User.findByIdAndUpdate(user._id, { root_folder_id: rootfolder._id });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  res
    .status(StatusCodes.CREATED)
    .json({ user: tokenUser, token, root_folder_id: rootfolder._id });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
    root_folder_id: user.root_folder_id,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
