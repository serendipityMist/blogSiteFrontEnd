const message = document.querySelector("#message");
const submit = document.querySelector("#submit");
const postContainer = document.querySelector("#messages");
const messageTitle = document.querySelector("#title");
let wordCount = document.querySelector("#wordCount");
let postMessage = JSON.parse(localStorage.getItem("posts")) || []; // Load from LocalStorage
let postID = postMessage.length;

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

// Load posts when the page loads
document.addEventListener("DOMContentLoaded", () => {
  createPostBox(postMessage);
});

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  let userData = await userCallFunc();

  if (!userData || !userData.results || userData.results.length === 0) {
    alert("Failed to fetch user data.");
    return;
  }

  let userImage = userData.results[0].picture.large;
  let userName = `${userData.results[0].name.first} ${userData.results[0].name.last}`;

  if (message.value.trim() === "" || messageTitle.value.trim() === "") {
    alert("Please enter some message before proceeding");
    return;
  }
  if (message.value.split(/\s+/).length < 30) {
    alert("The word count must be at least 30.");
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

  let newPost = {
    message: message.value,
    postID: ++postID,
    title: messageTitle.value,
    date: formattedDate,
    userImage: userImage,
    userName: userName,
  };

  postMessage.push(newPost);

  // Save to LocalStorage
  localStorage.setItem("posts", JSON.stringify(postMessage));

  messageTitle.value = "";
  message.value = "";
  wordCount.textContent = "";

  createPostBox(postMessage);
});

function createPostBox(postMessage) {
  postContainer.innerHTML = "";
  postMessage.forEach((post) => {
    posts(post);
  });
}

function posts(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("posts", `post-${post.postID}`);

  // User Info Container
  const userDiv = document.createElement("div");
  userDiv.classList.add("userContainer");

  const userImage = document.createElement("img");
  userImage.src = post.userImage;
  userImage.alt = "User Avatar";
  userImage.classList.add("userImage");

  const userName = document.createElement("p");
  userName.textContent = post.userName;
  userName.classList.add("userName");

  userDiv.appendChild(userImage);
  userDiv.appendChild(userName);

  // Post Content
  const topSection = document.createElement("div");
  topSection.classList.add("titleDelete");

  const postTitle = document.createElement("h1");
  postTitle.textContent = post.title;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";

  const postText = document.createElement("p");
  postText.textContent = post.message;

  const date = document.createElement("p");
  date.textContent = `Posted On: ${post.date}`;
  date.classList.add("postDate");

  postDiv.appendChild(userDiv);
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

  // Update LocalStorage after deletion
  localStorage.setItem("posts", JSON.stringify(postMessage));
}
