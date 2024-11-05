// Define the base URL for easy modification
const BASE_URL = "http://api.anrat.xyz:5000/";
const YTplaylistId = "PLAEnfbyXD6VmNMtp8F2ylofRc6nautGPk"
const gifList = [
  'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHBjMWYyb3ZqYzkwenVneGwya3JpcmEyZDJwMGlkbjg1eHdjdzBqMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vRnoppYtfEbemBO/giphy.webp', // Replace with actual GIF URLs
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHBxeDZqeHU4eWxhbDJvN2Y5eXEzZTF0ZXJhYndhMzVtZnU4aHY0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KZFrf9JusXzmpnPsT6/giphy.webp',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXN5OXVyOWZ4aWhlYnNtOHJxcmZmdGhnemdnZDVtN3pwdGk3dWUybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CJzxNL0RLzx7qqeI0F/giphy.webp',
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RzMWplaXR0ZmlwcHh6NXIzbW0xOGk3dzN1aHltbTdjaXMzeXNncCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7AtHoQ9XWbpwLRxs0t/giphy.webp",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3BlNGtzbnAxc2t0Y2JpemxlazQzamd5azJobW9uZnR3eWozNHBwdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BHNfhgU63qrks/giphy.webp",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGV5bGZ5aHJ5ZnMwd2ZhMDZlYWFmdmxzY2hnemh4YzNoMTh0bDBwbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZnKdSM5piRLDW/giphy.webp",
];
let apiEndpoint = `${BASE_URL}/get-files`; // Default endpoint

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar and Editor
  const sidebar = document.getElementById("data-sidebar");
  const editorFrame = document.getElementById("editorFrame");
  const currentTab = document.getElementById("currentTab");
  const fullscreenToggle = document.getElementById("fullscreenToggle");
  const editor = document.querySelector(".editor");
  const loadingScreen = document.getElementById("editorloadingscreen");
  let startedTheBack = false
  let pipWindow
  let [path, ...params] = ""

  function showGoodbyeScreen() {
    const goodbyeScreen = document.getElementById('goodbyeScreen');
    goodbyeScreen.classList.add('show');
  
    // Wait for the animation to end, then close the tab
    setTimeout(() => {
      window.location.href =  "javascript:window.open('','_self').close();"
    }, 3000); // Adjust to the animation duration (3 seconds in this case)
  }

  async function fetchSidebarData() {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data)
      renderSidebar(data);
      loadFileFromHash(data);
    } catch (error) {
      sidebar.textContent = "Failed to load data.";
      console.error("Fetch error: ", error);
    }
  }

  function renderSidebar(data) {
    sidebar.innerHTML = "";
    const rootList = createList(data);
    sidebar.appendChild(rootList);
  }

  function createList(data, currentPath = "") {
    const ul = document.createElement("ul");
  
    for (const key in data) {
      const li = document.createElement("li");
  
      if (key === "files" && typeof data[key] === "object") {
        Object.keys(data[key]).forEach((file) => {
          const filePath = `${currentPath}/${file}`.replace(/^\//, "");
          const fileExtension = file.split('.').pop();
          const fileLi = document.createElement("li");
  
          if (fileExtension === 'iframe') {
            fileLi.innerHTML = `<i class="fas fa-external-link-alt"></i> ${file}`;
            fileLi.classList.add("iframe-file");
            fileLi.addEventListener("click", (event) => {
              event.stopPropagation();
              window.location.hash = filePath; // Set the URL hash to the file path
            });
          } else if (fileExtension === 'link') {
            fileLi.innerHTML = `<i class="fas fa-link"></i> ${file}`;
            fileLi.classList.add("link-file");
            fileLi.addEventListener("click", (event) => {
              event.stopPropagation();
              window.location.hash = filePath;
            });
          } else if (fileExtension === 'txt') {
            fileLi.innerHTML = `<i class="fas fa-file-alt"></i> ${file}`;
            fileLi.classList.add("txt-file");
            fileLi.addEventListener("click", (event) => {
              event.stopPropagation();
              loadFileContent(file, data[key][file]);
              window.location.hash = filePath;
            });
          } else {
            // Default file icon for other files
            fileLi.innerHTML = `<i class="fas fa-file-code"></i> ${file}`;
            fileLi.classList.add("file");
            fileLi.addEventListener("click", (event) => {
              event.stopPropagation();
              loadFileContent(file, data[key][file]);
              window.location.hash = filePath;
            });
          }
  
          ul.appendChild(fileLi);
        });
      } else {
        const folderPath = `${currentPath}/${key}`.replace(/^\//, "");
        li.innerHTML = `<i class="fas fa-folder"></i> ${key}`;
        li.classList.add("folder");
  
        if (typeof data[key] === "object") {
          const nestedList = createList(data[key], folderPath);
          nestedList.classList.add("nested");
          nestedList.style.display = "none";
          li.appendChild(nestedList);
  
          li.addEventListener("click", (event) => {
            if (event.target === li || event.target.classList.contains("fa-folder")) {
              event.stopPropagation();
              nestedList.style.display = nestedList.style.display === "none" ? "block" : "none";
              li.classList.toggle("expanded");
            }
          });
        }
        
        ul.appendChild(li);
      }
    }
  
    return ul;
  }
  
  
  function loadFileContent(filename, content) {
    document.getElementById("currentTab").textContent = filename;
      const iframeDoc = editorFrame.contentDocument || editorFrame.contentWindow.document;
      const fileExtension = filename.split('.').pop();
    
      // Initialize global `window.parts` array if it doesn't exist
      if (!window.parts) {
        window.parts = [];
      }
    
      // Get the 'part' parameter from the URL hash if it exists
      const hash = window.location.hash.substring(1);
      const [, partParam] = hash.split('&');
      let part = null;
      
      if (partParam && partParam.startsWith('part=')) {
        part = partParam.split('=')[1];
        // Add part to the global parts array
        window.parts.push(part);
      }
    
      iframeDoc.open();
    
      if (fileExtension === 'txt') {
        iframeDoc.write(`
          <style>
            body {
              color: white;
              background-color: #1e1e1e;
              font-family: monospace;
              padding: 10px;
            }
          </style>
          <pre>${content}</pre>
          <script>
            // Access the global parts array in the iframe
            const parts = window.parent.parts;
          <\/script>
        `);
      } else if (fileExtension === 'link') {
        const fileLi = document.createElement("li");
        fileLi.innerHTML = `<i class="fas fa-link"></i> ${content}`;
        fileLi.classList.add("link-file");
        fileLi.addEventListener("click", (event) => {
          event.stopPropagation();
          const url = data[key][content].trim();
          window.open(url, "_blank");
        });
      } else {
        iframeDoc.write(`
          ${content}
          <script>
            // Access the global parts array in the iframe
            var parts = window.parent.parts;
            document.addEventListener("click", function(event) {
              const target = event.target;
              if (target.tagName === "A" && target.getAttribute("href")) {
                event.preventDefault();
                window.parent.location.href = target.href;
              }
            });
          <\/script>
        `);
      }
  
      iframeDoc.close();

      params.forEach(param => {
        if (param === 'fullscreen=true') {
          editor.classList.add("fullscreen"); // Apply fullscreen only to .editor
        }
    });
  }
  
  
  function loadFileFromHash(data) {
    const hash = window.location.hash.substring(1); // Get hash without the '#'
    if (!window.parts) {
      window.parts = []; // Initialize parts array
    }
    if (!hash) {
      if (data.files && data.files['index.html']) {
        loadFileContent("index.html", data.files['index.html']);
      }
      return;
    }
  
    [path, ...params] = hash.split('&');
    const pathSegments = path.split('/').filter(Boolean); // Split path into segments
    let currentData = data;
    let fullscreen = false;

    // Process each parameter
    params.forEach(param => {
        if (param.startsWith('part=')) {
            const part = param.split('=')[1];
            window.parts.push(part); // Add each part to the global parts array
        }
    });
  
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
      if (currentData[segment]) {
        currentData = currentData[segment];
      } else {
        console.warn(`Folder not found for segment: ${segment}`);
        return;
      }
    }
  
    const filename = pathSegments[pathSegments.length - 1];
    const fileExtension = filename.split('.').pop();
  
    if (fileExtension === 'iframe' && currentData.files && currentData.files[filename]) {
      const url = currentData.files[filename].trim();
  
      const iframeDoc = editorFrame.contentDocument || editorFrame.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <iframe id="embeddedContent" src="${url}" style="width:100%; height:100%; border:none;"></iframe>
        <script>
          // Access the global parts array in the iframe
          var parts = window.parent.parts;
        <\/script>
      `);
      iframeDoc.close();
    } else if (fileExtension === 'link' && currentData.files && currentData.files[filename]) {
      const url = currentData.files[filename].trim();
      window.open(url, "_blank");
    } else if (fileExtension === 'txt' && currentData.files && currentData.files[filename]) {
      loadFileContent(filename, currentData.files[filename]);
    } else if (currentData.files && currentData.files[filename]) {
      loadFileContent(filename, currentData.files[filename]);
    } else {
      console.warn(`File not found for path: ${hash}`);
    }

    currentTab.innerText = filename
  }
  
  
  
  

  fullscreenToggle.addEventListener("click", () => {
    editor.classList.toggle("fullscreen"); // Apply fullscreen only to .editor
    fullscreenToggle.classList.toggle("fa-expand");  // Toggle between expand and collapse icons
    fullscreenToggle.classList.toggle("fa-compress");
  });

  window.addEventListener("hashchange", () => fetchSidebarData());

  fetchSidebarData();

  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  const commands = {
    help: () => `Available commands:
      - help: Displays this help message
      - clear: Clears the terminal
      - echo [text]: Displays the provided text
      - date: Shows the current date and time
      - reload: Reloads the sidebar files
      - playlist: Opens YouTube mini-player with a random video
      - background: Changes the background
      - leave: Closes the tab`,


    clear: () => {
      terminalOutput.innerHTML = "";
      return "";
    },
    echo: (args) => args.join(" "),
    date: () => new Date().toString(),
    secret: () => {
      apiEndpoint = `${BASE_URL}/get-files-secret`;
      fetchSidebarData();
      return "Endpoint changed to get-files-secret";
    },
    special: () => {
      apiEndpoint = `${BASE_URL}/get-files-super-secret`;
      fetchSidebarData();
      return "Endpoint changed to get-files-super-secret";
    },
    reload: () => {
      fetchSidebarData();
      return "Sidebar reloaded using the current endpoint.";
    },
    playlist: (args) => {
      if (miniPlayer.style.display === "none") {
        miniPlayer.style.display = "block";
        if (args[0]) {
          miniPlayerFrame.src = miniPlayerEmbedUrl+"#playlistId="+args[0];
        } else {
          miniPlayerFrame.src = miniPlayerEmbedUrl;
        }
        return "Custom mini-player opened.";
      } else {
        miniPlayer.style.display = "none";
        miniPlayerFrame.src = ""; // Clear iframe to stop playback
        return "Custom mini-player closed.";
      }
    },
    background: (args) => {
      if (args[0]) {
        console.log(args[0])
        document.body.style.backgroundImage = `url('${args[0]}')`; // Apply the random GIF as background
        if (!startedTheBack) {
          document.body.classList.toggle("transparent-background"); // Toggle the background class
          document.querySelector(".container").classList.toggle("transparent-ui"); // Toggle transparency
          startedTheBack = true
        }
        return "Set background to url.";
      } else {
        const randomGif = gifList[Math.floor(Math.random() * gifList.length)]; // Select a random GIF
        document.body.style.backgroundImage = `url('${randomGif}')`; // Apply the random GIF as background
        if (!startedTheBack) {
          document.body.classList.toggle("transparent-background"); // Toggle the background class
          document.querySelector(".container").classList.toggle("transparent-ui"); // Toggle transparency
          startedTheBack = true
        }
        return "Random background GIF and transparency toggled.";
      }
    },
    leave: () => {
      window.location.href = "#index.html"
    },
    quit: () => {
      showGoodbyeScreen()
    },
  };

  terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const input = terminalInput.value.trim();
      if (input) {
        processCommand(input);
        terminalInput.value = "";
      }
    }
  });

  function processCommand(input) {
    appendToTerminal(`> ${input}`, "input");
    const [command, ...args] = input.split(" ");
    
    if (commands[command]) {
      const output = commands[command](args);
      if (output) appendToTerminal(output, "output");
    } else {
      try {
        const result = eval(input);
        appendToTerminal(result !== undefined ? result : "undefined", "output");
      } catch (error) {
        appendToTerminal(error, "error");
      }
    }
  }

  function appendToTerminal(text, type) {
    const line = document.createElement("div");
    line.className = "terminal-output"
    line.textContent = text;
    line.style.color = type === "error" ? "#f44747" : type === "output" ? "#9cdcfe" : "#d4d4d4";
    line.style.textShadow  = type === "error" ? "0 0 10px #f44747" : type === "output" ? "0 0 10px #9cdcfe" : "0 0 10px #d4d4d4";
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

    const miniPlayerEmbedUrl = `${BASE_URL}/access-file/Websites/Embeds/YTPlayer.html`;

    const miniPlayer = document.getElementById("miniPlayer");
    const miniPlayerFrame = document.getElementById("miniPlayerFrame");

    miniPlayer.style.display = "none";
});

window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.style.opacity = "0"; // Start fade-out
  setTimeout(() => {
    loadingScreen.style.display = "none"; // Hide after transition
  }, 500); // Match the duration of the CSS transition
});
