const User = require("../model/userModel");
const catchBlock = require("../utils/catchBlock");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const mailSend = require("../utils/mailsend");
const crypto = require("crypto");
const { request } = require("http");
const { log } = require("console");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECURITY, {
    expiresIn: process.env.TOKEN_EXP,
  });
};

sendCookieToken = (user, res) => {
  //console.log("ssssssssssss", user, res);
  const token = createToken(user._id);

  let cookieOption = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000),
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  };

  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.clearCookie("jwt");

  res.cookie("cookieToken", token, cookieOption);
  console.log("Cookie set successfully");

  //   res.status(200).json({
  //     status: "success",
  //     token,
  //     data: {
  //       user,
  //     },
  //   });
};

exports.logout = (req, res) => {
  console.log("ssdsdsd ----", req, req.header, "-----");
  console.log("22222 ----", req.headers.cookie);

  res.clearCookie("cookieToken");
  res.status(200).json({ status: "success" });
  //      res.status(200).json({
  //     status: 'success'
  //  })
};

exports.ifLoggedIn = (option) => {
  return catchBlock(async (req, res, next) => {
    const token = req.headers.cookie.split("=")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY);
    console.log("currentUser1");
    if (!decoded)
      return next(new AppError("you are not allowed, plz login", 400));

    let currentUser;
    if (!option) {
      currentUser = await User.findById(decoded.id).select(" -__v");
    } else {
      currentUser = await User.findById(decoded.id).select("+password -__v");
    }

    console.log("currentUser", decoded.id, currentUser);

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });
};

exports.createUser = catchBlock(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const userdata = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  const token = createToken(userdata.id);

  res.status(201).json({
    status: "user data added",
    token,
    userdata,
  });
});

exports.login = catchBlock(async (req, res, next) => {
  console.log("sdsdsdsd");

  const user = await User.findOne({ email: req.body.email }).select(
    "+password",
  );
  if (!user) next(new AppError("user invalid", 400));

  let match = await user.matchPass(req.body.password, user.password);
  //  console.log(req.body.password,"----", user.password, "---", match);

  if (!match) next(new AppError("password invalid", 400));
  //const token = createToken(user.id);
  sendCookieToken(user, res);

  res.status(201).json({
    status: "log in",
    //token,
    user,
  });
});

exports.protect = async (req, res, next) => {
  console.log("req", req.originalUrl);

  let token;
  // if(req.headers.authorization){
  //     token= (req.headers.authorization).split(' ')[1];

  // }
  if (req.headers.cookie) {
    token = req.headers.cookie.split("=")[1];
  }
  // console.log("hhhhh", req.headers.cookie);

  if (!token) return next(new AppError("you are not allowed, plz login", 400));

  const decoded = jwt.verify(token, process.env.TOKEN_SECURITY);

  if (!decoded)
    return next(new AppError("you are not allowed, plz login", 400));

  const currentUser = await User.findById(decoded.id);
  console.log("currentUser", decoded.id, currentUser);

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
};

exports.allowRole = (...role) => {
  return (req, res, next) => {
    let authuser = role.includes(req.user.role);

    if (!authuser)
      return next(new AppError("you are not authorize to act here", 400));

    next();
  };
};

exports.forgetPassword = catchBlock(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const tokenToSend = user.forgetToken();
  user.save({ validateBeforeSave: false });
  // console.log(tokenToSend);
  const url = `${request.protocol}://${req.get(
    "host",
  )}/api/v1/resetToken/${tokenToSend}`;

  const option = {
    to: user.email,
    sub: "try before 10 min",
    message: ` click in this url to reset password : ${url}`,
  };

  /// const sndmail = await mailSend(option)

  try {
    // await sendEmail({email: user.email,subject: 'Your password reset token (valid for 10 min)',message});
    await mailSend(option);
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
});

exports.resetToken = catchBlock(async (req, res, next) => {
  const tokenId = req.params.token;
  const savedToken = crypto.createHash("sha256").update(tokenId).digest("hex");

  const user = await User.findOne({
    resetToken: savedToken,
    resetTokenExpire: { $lt: Date.now() },
  });

  if (!user) return next(AppError("wrong token or expire token", 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  sendCookieToken(user, res);
});

exports.passwordUpdate = catchBlock(async (req, res, next) => {
  let user = req.user;
  const { oldPassword, password, confirmPassword } = req.body;

  const oldpass = await user.matchPass(oldPassword, user.password);

  if (!oldpass) return next(new AppError("old password is wrong", 404));

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  res.status(200).json({
    status: " password update",
  });
});
