const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComment = document.getElementById("videoComment");
const commentDeleteBtnAll = document.querySelectorAll(
  ".video__comment__delete-btn"
);

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.addEventListener("click", delComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

// 코드 챌린지 요기임니다!!! ♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙

// event -> 버튼 ❌에 대한 정보
const delComment = async (event) => {
  const parent = event.target.parentElement; // ❌ parent Element를 변수 parent에 저장.
  // 여가서 parent는 watch.pug ----> li.video__comment#videoComment(data-id=comment.id)이다.

  const commentId = parent.dataset.id;
  // li.video__comment#videoComment(요기!!✅data-id=comment.id✅요기!!)

  // fetch(url, options)
  // 아래 fetch에서 url을 DELETE method 방식으로 호출한다!!!
  await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });

  // parent를 remove!! HTML상에서 삭제하기!
  parent.remove();
};

// 요기까지 !!!! 😘

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
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
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
