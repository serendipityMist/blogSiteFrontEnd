const message = document.querySelector("#message");
const submit = document.querySelector("#submit");
const postContainer = document.querySelector("#messages");
const messageTitle = document.querySelector("#title");
let wordCount = document.querySelector("#wordCount");
let postMessage = [];
let comments = [];
let postID = 0;

message.addEventListener("input", () => {
  console.log(`The word count is ${message.value.split(/\s+/).length}`);
  wordCount.textContent = `Count: ${message.value.split(/\s+/).length}`;
});

submit.addEventListener("click", (e) => {
  e.preventDefault();

  if (message.value.trim() === "" || messageTitle.value.trim() === "") {
    alert("Please enter some message before proceeding");
    return;
  }
  if (message.value.split(/\s+/).length < 30) {
    alert("The word cound must be up to 30.");
    return;
  }

  //Trying to check whether there is post with same title
  let isDuplicate = postMessage.some(
    (element) => element.title === messageTitle.value
  );

  if (isDuplicate) {
    alert("A post with same title already exits....");
    return;
  }

  let getTime = new Date();
  let formattedDate = getTime.toLocaleString();

  postMessage.push({
    message: message.value,
    postID: postID,
    title: messageTitle.value,
    date: formattedDate,
  });

  messageTitle.value = "";
  message.value = "";
  wordCount.textContent = "";
  createPostBox(postMessage);
  console.log(postMessage);
});

function createPostBox(postMessage) {
  postContainer.innerHTML = "";
  postMessage.map((post, index) => {
    post.postID = index + 1;
    posts(post);
  });
}
function posts(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("posts", `post-${post.postID}`);

  const topSection = document.createElement("div");
  topSection.classList.add("titleDelete");

  const postTitle = document.createElement("h1");
  postTitle.textContent = post.title;

  const postText = document.createElement("p");
  postText.textContent = post.message;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";

  //Creating POST date
  const date = document.createElement("p");
  date.textContent = `Posted On: ${post.date}`;
  date.style.fontSize = "12px";
  date.style.color = "#bbb";

  postDiv.appendChild(topSection);
  topSection.appendChild(postTitle);
  topSection.appendChild(delBtn);
  postDiv.appendChild(postText);
  postDiv.appendChild(date);

  //TODO: ADD COMMENT SECTION //

  delBtn.addEventListener("click", () => {
    console.log(`The post ID is ${post.postID}`);
    console.log(`Post Message Value :`, [postMessage]);
    postDiv.remove();
    delPost(post.postID);
  });
  postContainer.appendChild(postDiv);
}

function delPost(id) {
  postMessage = postMessage.filter((element) => element.postID != id);

  console.log(postMessage);
}
