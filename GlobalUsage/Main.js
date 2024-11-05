function Main() {

    const content = document.querySelector('.content');
    const lineNumbers = document.getElementById('line-numbers');

    function generateLineNumbers() {
        if (content && lineNumbers) {
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
        
    }

    // Call function on initial load and on window resize for responsiveness
    window.addEventListener('load', generateLineNumbers);
    window.addEventListener('resize', generateLineNumbers);

    function applySlideInEffect() {
        document.querySelectorAll('*').forEach((element) => {
            element.classList.add('slide-in');
            setInterval(()=>{
                element.classList.remove('slide-in');
                element.classList.add('loaded');
            }, 499)
        });
        setInterval(refreshAllFilters, 500)
    }
    
    window.addEventListener('load', () => {
        applySlideInEffect();
    });
    
    // Apply the slide-in effect on page load
    document.addEventListener("DOMContentLoaded", () => {
        applySlideInEffect();
    });    

    function refreshAllFilters() {
        document.querySelectorAll('*').forEach((element) => {
            const currentFilter = window.getComputedStyle(element).filter; // Get the current filter
            element.style.filter = 'none'; // Temporarily clear the filter
            void element.offsetWidth; // Trigger reflow to apply the change
            element.style.filter = currentFilter; // Reapply the original filter
        });
    }

    // Reverse the filter effect before the user leaves the page
    function reverseFilter() {
        elements.forEach((element) => {
          element.style.transition = 'filter 0.5s ease'; // Optional: smooth transition
          element.style.filter = 'none'; // Remove the filter for the reverse effect
        });
      }
            
      // Intercept navigation to add delay for the reverse effect
    function handleNavigation(event) {
        event.preventDefault(); // Stop immediate navigation
        const targetUrl = event.currentTarget.href || event.currentTarget.action;
    
        reverseFilter(); // Apply the reverse effect
    
        setTimeout(() => {
        window.location.href = targetUrl; // Navigate after delay
        }, 500); // Adjust this delay to match your transition duration
    }
    

     // Attach event listeners to links and forms to intercept navigation
        document.querySelectorAll('*').forEach((link) => {
            link.addEventListener('click', handleNavigation);
        });
}
Main()