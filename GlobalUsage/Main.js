function Main() {
    let scrollFrame = document.getElementById('scrollFrame');
let cards = scrollFrame.children;
let currentIndex = 0;
let autoScrollInterval;
let userInteracted = false;

function scrollToNextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    const nextCard = cards[currentIndex];
    if (currentIndex === 0) {
        scrollFrame.scrollLeft = -1000
    } else {
        scrollFrame.scrollLeft = nextCard.offsetLeft;
    }
}

function startAutoScroll() {
    if (!userInteracted) {
        autoScrollInterval = setInterval(scrollToNextCard, 3000); // Change card every 3 seconds
    }
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Start auto-scroll on page load
startAutoScroll();

// Pause auto-scroll when the user interacts with the scroll frame
scrollFrame.addEventListener('mouseover', () => {
    userInteracted = true;
    stopAutoScroll();
});

// Resume auto-scroll after a period of inactivity
scrollFrame.addEventListener('mouseleave', () => {
    userInteracted = false;
    startAutoScroll();
});

// Reset the scroll position to the first card when the end is reached
scrollFrame.addEventListener('scroll', () => {
    if (scrollFrame.scrollLeft >= scrollFrame.scrollWidth - scrollFrame.clientWidth) {
        currentIndex = -1; // Reset index to -1 so it goes to 0 in scrollToNextCard()
    }
});

const content = document.querySelector('.content');
const lineNumbers = document.getElementById('line-numbers');

function generateLineNumbers() {
    // Clear existing line numbers
    lineNumbers.innerHTML = '';

    // Get the height of the content
    const contentHeight = content.offsetHeight;

    // Define the line number height (adjust based on font size and layout)
    const lineHeight = 24; // Customize this based on your design preferences

    // Calculate the number of lines needed based on content height
    const numberOfLines = Math.ceil(contentHeight / lineHeight);

    // Generate line numbers dynamically
    for (let i = 1; i <= numberOfLines; i++) {
        const line = document.createElement('div');
        line.textContent = i;
        line.style.height = `${lineHeight}px`;
        lineNumbers.appendChild(line);
    }
}

// Call function on initial load and on window resize for responsiveness
window.addEventListener('load', generateLineNumbers);
window.addEventListener('resize', generateLineNumbers);
}
Main()