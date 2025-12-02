function handleLikeClick(container) {
    container.addEventListener("click", (e) => {
        const likeBtn = e.target.closest(".heart");
        if (!likeBtn) return;

        const likeCount = likeBtn.closest(".like-count");
        likeCount.classList.toggle("active");

        const countElem = likeCount.querySelector("span");
        let count = parseLikeCount(countElem.textContent);

        if (likeCount.classList.contains("active")) {
            likeBtn.src = "/images/icons/heart-filled-icon.svg";
            count += 1;
        } else {
            likeBtn.src = "/images/icons/heart-outline-icon.svg";
            count -= 1;
        }

        countElem.textContent = formatLikeCount(count);
    });
}

function handleBookmarkClick(container) {
    container.addEventListener("click", (e) => {
        const bookmarkBtn = e.target.closest(".bookmark-btn");
        if (!bookmarkBtn) return;

        bookmarkBtn.classList.toggle("saved");
        const bookmarkImg = bookmarkBtn.querySelector("img");

        if (bookmarkBtn.classList.contains("saved")) {
            bookmarkImg.src = "/images/icons/bookmark-filled-icon.svg";
        } else {
            bookmarkImg.src = "/images/icons/bookmark-outline-icon.svg";
        }
    });
}

function handleCommentClick(container) {
    container.addEventListener("click", (e) => {
        const commentBtn = e.target.closest(".comment");
        if (!commentBtn) return;
        const postId = commentBtn.dataset.id;
        if (!postId) return;
        window.location.href =`/post/${postId}?scroll=comment`;
    })
}

function handleRemoveClick(container) {
    container.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".remove-post");
        if (!removeBtn) return;

        const postCard = removeBtn.closest(".post__card");
        if (postCard) {
            postCard.classList.add("hidden");

            setTimeout(() => {
                postCard.style.display = "none";
            }, 400); // match CSS transition time
        }
    })
}

function getRandomLikeCount() {
    const num = Math.floor(Math.random() * 15000) + 1; // 1 → 15000
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}

function parseLikeCount(str) {
    str = str.trim().toUpperCase();
    if (str.endsWith("K")) {
        return parseFloat(str) * 1000;
    }
    return parseInt(str);
}

// 5600 → "5.6K"
function formatLikeCount(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}


export { handleLikeClick, handleBookmarkClick, getRandomLikeCount, handleCommentClick, handleRemoveClick };