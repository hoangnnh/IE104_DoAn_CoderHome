function handleLikeClick() {
    document.querySelectorAll(".like-count").forEach((item) => {
        const likeBtn = item.querySelector(".heart");
        likeBtn.addEventListener("click", () => {
            item.classList.toggle("active");
            const countElem = item.querySelector("span")
            let likeCount = parseLikeCount(countElem.textContent);
            if (item.classList.contains("active")) {
                likeBtn.src = "/images/icons/heart-filled-icon.svg";
                likeCount += 1;
            } else {
                likeBtn.src = "/images/icons/heart-outline-icon.svg";
                likeCount -= 1;
            }

            countElem.textContent = formatLikeCount(likeCount);
        });
    });
}

function handleBookmarkClick() {
    document.querySelectorAll(".bookmark-btn").forEach((item) => {
        item.addEventListener("click", () => {
            item.classList.toggle("saved");
            const bookmarkImg = item.querySelector("img");
            if (item.classList.contains("saved")) {
                bookmarkImg.src = "/images/icons/bookmark-filled-icon.svg";
            } else {
                bookmarkImg.src = "/images/icons/bookmark-outline-icon.svg";
            }
        })
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


export { handleLikeClick, handleBookmarkClick, getRandomLikeCount };