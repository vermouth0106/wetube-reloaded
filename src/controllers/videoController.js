import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const textHanlder = (req, res) => {
  req.send("hello");
};

// 코드 챌린지 요기임니다!!! ♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙

export const removeComment = async (req, res) => {
  const {
    user: { _id },
  } = req.session; // 현재 로그인한 유저의 정보(세션)

  const {
    params: { id },
  } = req; // commentSection.js ---->  await fetch(`/api/comments/요기!!✅${commentId}✅요기!!`, ...)

  const comment = await Comment.findById(id); // wetube 데이터베이스 comment 안에 req.params.id 값과 같은 id 값이 있는가?!

  // 데이터베이스에서 찾지 못했으면 comment는 null 즉 false이다. 그러므로 not연산(뒤집기 연산) '!' 를 해서 if 조건문이 실행되는 '참(true)'로 바꿔준다.
  if (!comment) {
    return res.sendStatus(404);
  }

  // commnet.owner(댓글 작성자)와 req.session._id(현재 접속자)가 다르면 에러 코드를 보낸다.
  if (String(comment.owner) !== String(_id)) {
    return res.sendStatus(403);
  }

  // 그럼 왜 변수 comment를 썼느냐? Commnet.findById를 했을 때 값이 존재하는지 안 하는지 확인하기 위해서!!
  // 매번 조건문에서 Commnet.findById를 하기엔 시간이 너무 오래 걸린다! 코드 작성이 어렵고 실행 시간도 길어진다!(실행 시간은 데이터베이스 접근 시간 때문이다!)
  // 결국 데이터베이스 comments에서 req.paprams.id와 같은 id의 comment를 찾아 Delete한다!
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(201);
};

// 요기까지 !!!! 😘
