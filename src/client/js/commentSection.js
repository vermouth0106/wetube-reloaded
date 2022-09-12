const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComment = document.getElementById("videoComment");
const commentDeleteBtnAll = document.querySelectorAll(
  ".video__comment__delete-btn"
);

const addComment = (textValue, id, owner, createdAt) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const img = document.createElement("img");
  img.className = "video__comment__owner-avatar";
  if (owner.avatarUrl.substring(0, 4) === "http") {
    img.src = owner.avatarUrl;
  } else {
    img.src = "/" + owner.avatarUrl;
  }
  newComment.appendChild(img);
  const info = document.createElement("div");
  info.className = "video__comment__info";
  const data = document.createElement("div");
  data.className = "video__comment__data";
  const ownerInfo = document.createElement("div");
  ownerInfo.className = "video__comment__owner__info";
  const ownerName = document.createElement("a");
  ownerName.href = `/users/${owner._id}`;
  ownerName.className = "video__comment__owner-name";
  const ownerNameSpan = document.createElement("span");
  ownerNameSpan.innerText = `${owner.name}`;
  ownerName.appendChild(ownerNameSpan);
  const time = document.createElement("span");
  time.className = "video__comment__createdAt";
  time.innerText = `${createdAt.getFullYear()}. ${
    createdAt.getMonth() + 1
  }. ${createdAt.getDate()}`;
  ownerInfo.appendChild(ownerName);
  ownerInfo.appendChild(time);
  const text = document.createElement("span");
  text.className = "video__comment__text";
  text.innerText = ` ${textValue}`;
  data.appendChild(ownerInfo);
  data.appendChild(text);
  info.appendChild(data);
  const controllers = document.createElement("div");
  controllers.className = "video__comment__conrollers";
  const del = document.createElement("p");
  del.className = "video__comment__delete-btn";
  del.innerText = "Del";
  del.addEventListener("click", delComment);
  controllers.appendChild(del);
  info.appendChild(controllers);
  videoComments.prepend(newComment);
  newComment.appendChild(info);
};

const delComment = async (event) => {
  const parent = event.target.closest(".video__comment");
  const commentId = parent.dataset.id;
  await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  parent.remove();
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, owner, createdAt } = await response.json();
    addComment(text, newCommentId, owner, new Date(createdAt));
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (videoComment) {
  commentDeleteBtnAll.forEach((btn) =>
    btn.addEventListener("click", delComment)
  );
}
