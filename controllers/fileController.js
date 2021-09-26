const file = require('../models/fileModel');
const catchAsync = require('../utils/catchAsync');
const mime = require('mime');
const path = require('path');
const fs = require('fs');

exports.upload = catchAsync(async (req, res, next) => {
  console.log('USER', req.user);
  let date = new Date().toLocaleString();
  let dataString = date.replace(' ', '-');
  let dateupdate = dataString.replace(' ', '-');

  // console.log("CHeck", req.body.image);
  var matches = await req.body.image.match(
      /^data:([A-Za-z-+\/]+);base64,(.+)$/
    ),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];

  response.data = new Buffer.from(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  const name = type.split('/');

  const name1 = name[0];

  let extension = mime.getExtension(type);

  const rand = Math.ceil(Math.random() * 1000);
  //Random photo name with timeStamp so it will not overide previous images.
  const fileName = `${req.user.name}-${Date.now()}.${extension}`;
  console.log(fileName);
  let abc = 'abc';
  path3 = path.resolve(`./public/storeImages/`);

  let localpath = `${path3}/${req.user._id}/`;

  if (!fs.existsSync(localpath)) {
    fs.mkdirSync(localpath);
  }

  fs.writeFileSync(`${localpath}` + fileName, imageBuffer, 'utf8');
  ip = 'localhost:4000';

  const url = `${req.protocol}://${ip}/storeImages/${req.user._id}/${fileName}`;
  const secretCode = Math.floor(100000 + Math.random() * 90000);
  console.log(secretCode);
  // http://localhost:3000/storeImages/614ed8583ed37e0d15d328bd/Ankita-1632561623446.jpeg

  const img = {
    image: url,
    userId: req.user._id,
    secretCode: secretCode,
    fileName: req.body.fileName,
  };
  const data = await file.create(img);

  return res.status(200).json({
    status: 'success',
    data: data,
  });
});

exports.fileShow = async (req, res) => {
  try {
    console.log(req.user);
    const filelist = await file.find({ userId: req.user._id });

    res.status(200).json({
      status: 'success',
      data: filelist,
    });
  } catch (err) {
    console.log('Error', err);
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.deletefile = async (req, res) => {

  console.log(req.body);
  try {
    const del = await file.findByIdAndDelete({ _id: req.body.id });
    res.status(200).json({
      status: 'success',
      message: 'File deleted successfully!',
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 'fail',
      message: 'File not deleted, try again !!',
    });
  }
};
