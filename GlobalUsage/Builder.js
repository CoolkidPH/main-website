document.addEventListener("DOMContentLoaded", function() {
    const widgets = document.querySelectorAll(".widget");
    const workspace = document.getElementById("workspace");
    const editorModal = document.getElementById("editorModal");
    const saveEdit = document.getElementById("saveEdit");
    const deleteWidget = document.getElementById("deleteWidget");

    // Project editor input fields
    const projectTitle = document.getElementById("projectTitle");
    const projectDescription = document.getElementById("projectDescription");
    const projectImage = document.getElementById("projectImage");
    const projectLink = document.getElementById("projectLink");
    const addProject = document.getElementById("addProject");

    let currentWidget = null;
    let currentProjectList = [];

    // Enable drag events for widgets
    widgets.forEach(widget => {
        widget.addEventListener("dragstart", function(e) {
            e.dataTransfer.setData("type", widget.dataset.type);
        });
    });

    // Allow dropping on workspace
    workspace.addEventListener("dragover", function(e) {
        e.preventDefault();
    });

    workspace.addEventListener("drop", function(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData("type");
        addWidgetToWorkspace(type, e.clientX, e.clientY);
    });

    // Function to add widget to workspace with consistent styling
    function addWidgetToWorkspace(type, x, y) {
        const widget = document.createElement("div");
        widget.classList.add("workspace-widget", "project-card");
        widget.style.position = "absolute";
        widget.style.top = `${y - workspace.offsetTop}px`;
        widget.style.left = `${x - workspace.offsetLeft}px`;

        if (type === "project") {
            // Project widget structure
            widget.innerHTML = `<h2>Project Widget</h2><div class="project-list"></div>`;
            currentProjectList = widget.querySelector(".project-list");
        }

        // Click event to open editor modal for the project widget
        widget.addEventListener("click", () => {
            currentWidget = widget;
            editorModal.style.display = "block";
        });

        workspace.appendChild(widget);
    }

    // Add a project card to the current project widget
    addProject.addEventListener("click", () => {
        if (currentWidget && currentProjectList) {
            const card = document.createElement("div");
            card.classList.add("project-card");

            // Create the structure of a project card
            card.innerHTML = `
                <img src="${projectImage.value || './Images/sample.jpg'}" alt="${projectTitle.value}">
                <h3>${projectTitle.value}</h3>
                <p>${projectDescription.value}</p>
                <a href="${projectLink.value}" target="_blank">Link</a>
            `;

            currentProjectList.appendChild(card);
            clearInputs();
        }
    });

    // Save changes to the project widget (close editor modal)
    saveEdit.addEventListener("click", () => {
        editorModal.style.display = "none";
    });

    // Delete the entire widget
    deleteWidget.addEventListener("click", () => {
        if (currentWidget) {
            currentWidget.remove();
            currentWidget = null;
        }
        editorModal.style.display = "none";
    });

    // Clear input fields after adding a project
    function clearInputs() {
        projectTitle.value = "";
        projectDescription.value = "";
        projectImage.value = "";
        projectLink.value = "";
    }
});
