const message = document.querySelector("#message");
const submit = document.querySelector("#submit");
const postContainer = document.querySelector("#messages");
const messageTitle = document.querySelector("#title");
let wordCount = document.querySelector("#wordCount");
let postMessage = [];
let postID = 0;

// Fetch random user API
const userCallFunc = async () => {
  try {
    let response = await fetch("https://randomuser.me/api/");
    let data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};

message.addEventListener("input", () => {
  wordCount.textContent = `Count: ${message.value.split(/\s+/).length}`;
});

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  let userData = await userCallFunc(); // Await the API response

  if (!userData || !userData.results || userData.results.length === 0) {
    alert("Failed to fetch user data.");
    return;
  }

  let userImage = userData.results[0].picture.large;
  let userName = userData.results[0].name.first + userData.results[0].name.last;

  if (message.value.trim() === "" || messageTitle.value.trim() === "") {
    alert("Please enter some message before proceeding");
    return;
  }
  if (message.value.split(/\s+/).length < 30) {
    alert("The word count must be up to 30.");
    return;
  }

  let isDuplicate = postMessage.some(
    (element) => element.title === messageTitle.value
  );

  if (isDuplicate) {
    alert("A post with the same title already exists.");
    return;
  }

  let formattedDate = new Date().toLocaleString();

  postMessage.push({
    message: message.value,
    postID: postID,
    title: messageTitle.value,
    date: formattedDate,
    userImage: userImage,
    userName: userName,
  });

  messageTitle.value = "";
  message.value = "";
  wordCount.textContent = "";

  createPostBox(postMessage);
});

function createPostBox(postMessage) {
  postContainer.innerHTML = "";
  postMessage.forEach((post, index) => {
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

  const image = document.createElement("img");
  image.src = post.userImage;
  image.alt = "User Avatar";
  image.style.width = "50px";
  image.style.borderRadius = "50%";

  const userName = document.createElement("p");
  userName.textContent = post.userName;
  userName.style.color = "#bbb";

  const date = document.createElement("p");
  date.textContent = `Posted On: ${post.date}`;
  date.style.fontSize = "12px";
  date.style.color = "#bbb";

  postDiv.appendChild(image);
  postDiv.appendChild(userName);
  postDiv.appendChild(topSection);
  topSection.appendChild(postTitle);
  topSection.appendChild(delBtn);
  postDiv.appendChild(postText);
  postDiv.appendChild(date);

  delBtn.addEventListener("click", () => {
    postDiv.remove();
    delPost(post.postID);
  });

  postContainer.appendChild(postDiv);
}

function delPost(id) {
  postMessage = postMessage.filter((element) => element.postID !== id);
}
