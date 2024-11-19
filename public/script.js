let currentSessionMessages = []; // Store messages for the current session

// document.addEventListener("DOMContentLoaded", () => {
//     // Initialize calendar
//     generateCalendar();

//     // Hide all pages initially except the home page
//     document.querySelectorAll('.page').forEach(pageDiv => pageDiv.classList.add('hidden'));
//     document.getElementById('home-page').classList.remove('hidden'); // Show only the home page by default

//     // Set up navigation button clicks
//     document.querySelectorAll(".nav-buttons button").forEach(button => {
//         button.addEventListener("click", (event) => {
//             const page = event.target.getAttribute("onclick").match(/'([^']+)'/)[1];
//             navigateTo(page);
//         });
//     });

//     // Add event listener for "Enter" key in the chat input field
//     const userInput = document.getElementById("user-input");
//     userInput.addEventListener("keypress", (event) => {
//         if (event.key === "Enter") {
//             event.preventDefault();
//             sendMessage();
//         }
//     });

//     // Bind Word Cloud button to its navigation function
//     document.getElementById('word-cloud-button').addEventListener('click', navigateToWordCloud);

//     // Load journal entries and generate the word cloud
//     const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
//     const wordFrequency = calculateWordFrequency(journalEntries);
//     renderWordCloud(wordFrequency);

//     // Save the current session when leaving the page or closing the browser
//     window.addEventListener("beforeunload", saveJournalEntry);
// });
document.addEventListener("DOMContentLoaded", () => {
    // Initialize calendar
    generateCalendar();

    // Hide all pages initially except the home page
    document.querySelectorAll('.page').forEach(pageDiv => pageDiv.classList.add('hidden'));
    document.getElementById('home-page').classList.remove('hidden'); // Show only the home page by default

    // Set up navigation button clicks
    document.querySelectorAll(".nav-buttons button").forEach(button => {
        button.addEventListener("click", (event) => {
            const page = event.target.getAttribute("onclick").match(/'([^']+)'/)[1];
            navigateTo(page);
        });
    });

    // Bind Word Cloud button to its navigation function
    document.getElementById('word-cloud-button').addEventListener('click', navigateToWordCloud);

    // Add event listener for "Enter" key in the chat input field
    const userInput = document.getElementById("user-input");
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // Load journal entries and generate the word cloud
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const wordFrequency = calculateWordFrequency(journalEntries);
    renderWordCloud(wordFrequency);

    // Save the current session when leaving the page or closing the browser
    window.addEventListener("beforeunload", saveJournalEntry);
});

// Function to navigate between pages
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(pageDiv => pageDiv.classList.add('hidden'));
    const chatBoxFooter = document.getElementById('chat-box-footer-container');

    switch (page) {
        case 'home':
            document.getElementById('home-page').classList.remove('hidden');
            if (chatBoxFooter) chatBoxFooter.classList.add('hidden');
            break;
        case 'about':
            document.getElementById('about-page').classList.remove('hidden');
            if (chatBoxFooter) chatBoxFooter.classList.add('hidden');
            break;
        case 'main-journaling':
            document.getElementById('main-journaling-section').classList.remove('hidden');
            if (chatBoxFooter) chatBoxFooter.classList.remove('hidden');
            currentSessionMessages = [];
            loadJournalSidebar();
            break;
        default:
            console.error(`Unknown page: ${page}`);
    }
}

// // Send Message to AI
// async function sendMessage() {
//     const userInput = document.getElementById("user-input");
//     const message = userInput.value.trim();
//     if (!message) return;

//     displayMessage(message, "message");
//     currentSessionMessages.push({ type: "user", text: message });
//     userInput.value = "";

//     try {
//         const response = await fetch("/chat", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ message, topic: currentSessionMessages[0]?.text || "" }),
//         });

//         const data = await response.json();
//         displayMessage(data.response, "response");
//         currentSessionMessages.push({ type: "ai", text: data.response });
//     } catch (error) {
//         console.error("Error:", error);
//         displayMessage("Sorry, something went wrong.", "response");
//     }
// }

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (!message) return;

    // Display the user's message
    displayMessage(message, "message");
    currentSessionMessages.push({ type: "user", text: message });
    userInput.value = "";

    // Extract keywords and store in localStorage
    const keywords = extractKeywords(message);
    const journalKeywords = JSON.parse(localStorage.getItem("journalKeywords")) || [];
    const updatedKeywords = new Set([...journalKeywords, ...keywords]); // Ensure uniqueness
    localStorage.setItem("journalKeywords", JSON.stringify([...updatedKeywords]));

    try {
        // Send message to server
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message, 
                topic: currentSessionMessages[0]?.text || "" 
            }),
        });

        // Handle server response
        const data = await response.json();
        displayMessage(data.response, "response");
        currentSessionMessages.push({ type: "ai", text: data.response });
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Sorry, something went wrong.", "response");
    }
}


// Helper function to extract keywords
function extractKeywords(text) {
    const stopWords = ["the", "and", "to", "of", "a", "is", "in", "it", "that", "on", "because", "bc", "but", "am", "my", "i"]; // Add more as needed
    return text
        .split(/\s+/)
        .map((word) => word.toLowerCase())
        .filter((word) => !stopWords.includes(word));
}



// Display message in the chat box
function displayMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Save the current session as a journal entry
// Save the current session as a journal entry
function saveJournalEntry() {
    if (currentSessionMessages.length === 0) return;

    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const entryName = prompt("Name your journal entry:", `Journal Entry ${journalEntries.length + 1}`);
    const entry = {
        id: Date.now(),
        name: entryName || `Journal Entry ${journalEntries.length + 1}`,
        date: new Date().toLocaleString(),
        messages: currentSessionMessages,
    };

    journalEntries.push(entry);
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
    currentSessionMessages = [];
}


// Load saved journal entries into the sidebar
function loadJournalSidebar() {
    const journalSidebar = document.getElementById("journal-entries");
    journalSidebar.innerHTML = ""; // Clear existing entries
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

    journalEntries.forEach(entry => {
        const listItem = document.createElement("li");

        // Display journal entry name and date
        const textSpan = document.createElement("span");
        textSpan.textContent = entry.name ? `${entry.name} (${entry.date})` : entry.date;
        textSpan.title = entry.name ? `${entry.name} (${entry.date})` : entry.date; // Tooltip for full name
        textSpan.className = "journal-entry-text"; // Add class for styling
        listItem.appendChild(textSpan);

        // Add three-dot menu
        const menuButton = document.createElement("button");
        menuButton.className = "entry-menu-button";
        menuButton.innerHTML = "&#x22EE;"; // Unicode for vertical ellipsis (three dots)
        menuButton.onclick = (e) => {
            e.stopPropagation(); // Prevent menu click from triggering journal entry view
            openEntryMenu(e, entry.id);
        };

        listItem.appendChild(menuButton);

        // Attach click event to load the journal entry into the chat interface
        listItem.onclick = () => {
            navigateTo('main-journaling'); // Navigate to the main journaling page
            viewJournalEntry(entry); // Load the selected entry into the chat
        };

        journalSidebar.appendChild(listItem);
    });
}

// Navigate to the Word Cloud page and save journal entries
function navigateToWordCloud() {
    // Save journal entries to localStorage for the word cloud page
    const journalEntries = getJournalEntries(); // Assume this function fetches all entries
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

    // Redirect to the word cloud page
    window.location.href = '/word-cloud.html';
}

// Fetch journal entries from the sidebar
function getJournalEntries() {
    const entries = [];
    document.querySelectorAll('#journal-entries li').forEach((li) => {
        entries.push(li.textContent);
    });
    return entries;
}

// View specific journal entry in the chat
function viewJournalEntry(entry) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ""; // Clear the chat box

    entry.messages.forEach(message => {
        displayMessage(message.text, message.type === "user" ? "message" : "response");
    });
}

// Function to go back to home page and save the journal entry
function goBackHome() {
    saveJournalEntry(); // Save current session
    navigateTo("home"); // Navigate to home page
}

// Toggle journal sidebar visibility
function toggleJournalSidebar() {
    const sidebar = document.getElementById("journal-sidebar");
    const chatBoxFooter = document.querySelector(".chat-box-footer");

    sidebar.classList.toggle("hidden");

    if (!sidebar.classList.contains("hidden")) {
        chatBoxFooter.classList.add("with-sidebar");
    } else {
        chatBoxFooter.classList.remove("with-sidebar");
    }
}

// Open menu for rename/delete
function openEntryMenu(event, entryId) {
    // Remove any existing menu to prevent duplicates
    const existingMenu = document.querySelector(".entry-menu");
    if (existingMenu) existingMenu.remove();

    // Create the menu
    const menu = document.createElement("div");
    menu.className = "entry-menu";
    menu.innerHTML = `
        <button onclick="renameJournalEntry(${entryId})">Rename</button>
        <button onclick="deleteJournalEntry(${entryId})">Delete</button>
    `;

    // Position the menu near the button
    menu.style.position = "absolute";
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;

    // Append the menu to the body
    document.body.appendChild(menu);

    // Close the menu when clicking elsewhere
    document.addEventListener("click", () => menu.remove(), { once: true });
    event.stopPropagation(); // Prevent triggering other events
}

// Rename a journal entry
function renameJournalEntry(entryId) {
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const entryIndex = journalEntries.findIndex(e => e.id === entryId);
    if (entryIndex === -1) return; // Entry not found

    const newName = prompt("Enter a new name for this journal entry:", journalEntries[entryIndex].name || journalEntries[entryIndex].date);
    if (newName) {
        journalEntries[entryIndex].name = newName; // Update the name
        localStorage.setItem("journalEntries", JSON.stringify(journalEntries)); // Save to localStorage
        loadJournalSidebar(); // Refresh the sidebar
    }
}

// Delete a journal entry
function deleteJournalEntry(entryId) {
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const updatedEntries = journalEntries.filter(e => e.id !== entryId); // Remove the entry
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries)); // Save updated list to localStorage
    loadJournalSidebar(); // Refresh the sidebar
}

// Filter journal entries
function filterJournalEntries() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const journalEntries = document.querySelectorAll("#journal-entries li");

    journalEntries.forEach(entry => {
        const entryText = entry.querySelector(".journal-entry-text").textContent.toLowerCase();
        entry.style.display = entryText.includes(searchValue) ? "" : "none";
    });
}


// Give Summary of the conversation
async function giveSummary() {
    if (currentSessionMessages.length === 0) {
        displayMessage("No conversation to summarize.", "response");
        return;
    }

    const userMessages = currentSessionMessages
        .filter(msg => msg.type === "user")
        .map(msg => msg.text)
        .join(" ");
    const aiMessages = currentSessionMessages
        .filter(msg => msg.type === "ai")
        .map(msg => msg.text)
        .join(" ");
    const summaryPrompt = `
        Please summarize this conversation. 
        User's input: ${userMessages}
        AI's advice: ${aiMessages}
        Include the following:
        1. Where the user started.
        2. Any tips or guidance the AI gave.
        3. How the user can improve or has improved.
    `;

    displayMessage("Summarizing the conversation...", "response");

    try {
        const response = await fetch("/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: currentSessionMessages }),
        });

        const data = await response.json();
        displayMessage(data.response, "response");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Sorry, something went wrong while summarizing.", "response");
    }
}

// Display mood graph on the page
function displayMoodGraph(moodData) {
    const moodGraphContainer = document.getElementById("mood-graph-container");
    moodGraphContainer.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.id = "moodGraph";
    moodGraphContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(moodData),
            datasets: [{
                data: Object.values(moodData),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Mood Distribution" },
            },
        },
    });
}


async function generateMoodGraph() {
    if (currentSessionMessages.length === 0) {
        displayMessage("No messages to analyze for mood.", "response");
        return;
    }

    const userMessages = currentSessionMessages
        .filter(msg => msg.type === "user")
        .map(msg => msg.text)
        .join(" ");

    displayMessage("Analyzing mood...", "response");

    try {
        console.log("Sending data for mood analysis:", userMessages); // Debug
        const response = await fetch("/analyze-mood", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: userMessages }),
        });

        const data = await response.json();
        console.log("Mood analysis response:", data); // Debug

        if (data.moodAnalysis) {
            renderMoodGraph(data.moodAnalysis);
        } else {
            displayMessage("Failed to generate mood graph. Please try again.", "response");
        }
    } catch (error) {
        console.error("Error generating mood graph:", error);
        displayMessage("Sorry, something went wrong while generating the mood graph.", "response");
    }
}


// Render Mood Graph
function renderMoodGraph(moodData) {
    const moodGraphContainer = document.getElementById("mood-graph-container");
    moodGraphContainer.style.display = "block"; // Show the graph container

    const canvas = document.createElement("canvas");
    canvas.id = "mood-graph";
    moodGraphContainer.innerHTML = ""; // Clear any existing content
    moodGraphContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Prepare data for the chart
    const labels = Object.keys(moodData);
    const values = Object.values(moodData);

    // Render the chart using Chart.js
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Mood Analysis",
                    data: values,
                    backgroundColor: "rgba(106, 13, 173, 0.6)",
                    borderColor: "rgba(106, 13, 173, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Calculate word frequency
function calculateWordFrequency(journalEntries) {
    const stopwords = ["and", "the", "of", "to", "in", "a", "is", "it", "that", "on"];
    const wordFrequency = {};

    journalEntries.forEach(entry => {
        const words = entry.content.toLowerCase().split(/\W+/); // Split words using non-alphanumeric chars
        words.forEach(word => {
            if (word && !stopwords.includes(word)) {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            }
        });
    });

    return Object.entries(wordFrequency).map(([word, count]) => ({ text: word, size: count }));
}


function renderWordCloud(words) {
    const container = document.getElementById("word-cloud-container");
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Clear existing word cloud
    container.innerHTML = "";

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (Math.random() > 0.5 ? 0 : 90))
        .font("Impact")
        .fontSize(d => Math.sqrt(d.size) * 10)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Impact")
            .style("fill", (_, i) => d3.schemeCategory10[i % 10])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
            .on("click", d => filterJournalEntriesByWord(d.text));
    }
}


window.addEventListener("resize", () => {
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const wordFrequency = calculateWordFrequency(journalEntries);
    renderWordCloud(wordFrequency);
});


function filterJournalEntriesByWord(word) {
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const filteredEntries = journalEntries.filter(entry =>
        entry.content.toLowerCase().includes(word.toLowerCase())
    );

    // Display filtered journal entries
    const journalSidebar = document.getElementById("journal-entries");
    journalSidebar.innerHTML = ""; // Clear existing entries

    filteredEntries.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.name} (${entry.date})`;
        journalSidebar.appendChild(listItem);
    });
}


function toggleWordCloud() {
    const wordCloudSection = document.getElementById('word-cloud-section');
    wordCloudSection.classList.toggle('hidden');
}

// function generateWordCloud() {
//     const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
//     const wordFrequency = calculateWordFrequency(journalEntries);

//     if (wordFrequency.length === 0) {
//         alert("No words available to generate the word cloud.");
//         return;
//     }

//     renderWordCloud(wordFrequency);
//     toggleWordCloud(); // Show the word cloud section
// }

// function generateWordCloud() {
//     const keywords = JSON.parse(localStorage.getItem("journalKeywords")) || [];
//     if (keywords.length === 0) {
//         wordCloudDiv.textContent = "No keywords to display.";
//     } else {
//         const cloudContent = `Generated Word Cloud: ${keywords.join(", ")}`;
//         localStorage.setItem("currentWordCloud", cloudContent); // Save state
//         wordCloudDiv.textContent = cloudContent;
//     }
//     homePage.style.display = "none";
//     wordCloudPage.style.display = "block";
// }
// Generate Word Cloud
function generateWordCloud() {
    const keywords = JSON.parse(localStorage.getItem("journalKeywords")) || [];
    if (keywords.length === 0) {
        wordCloudDiv.textContent = "No keywords to display.";
        return;
    } else {
        const cloudContent = `Generated Word Cloud: ${keywords.join(", ")}`;
        localStorage.setItem("currentWordCloud", cloudContent); // Save state
        wordCloudDiv.textContent = cloudContent;
    }

    // Calculate word frequencies
    const wordCounts = {};
    keywords.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Clear previous word cloud
    wordCloudDiv.innerHTML = "";

    // Generate word cloud dynamically
    for (const [word, count] of Object.entries(wordCounts)) {
        const span = document.createElement("span");
        const fontSize = 10 + count * 5; // Adjust scaling factor (10px base + 5px per count)
        span.textContent = word;
        span.style.fontSize = `${fontSize}px`;
        span.style.margin = "5px";
        span.style.display = "inline-block";
        span.style.color = getRandomColor();
        wordCloudDiv.appendChild(span);
    }

    // Show the word cloud page
    homePage.style.display = "none";
    wordCloudPage.style.display = "block";
}

// Random Color Generator for Words
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Load saved word cloud on page visit
const savedWordCloud = localStorage.getItem("currentWordCloud");
if (savedWordCloud) {
    wordCloudDiv.textContent = savedWordCloud;
}


function startJournalEntry(topic) {
    // Save the new journal entry with the topic as its name
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const newEntry = {
        id: Date.now(),
        name: topic,
        date: new Date().toLocaleString(),
        messages: [{ type: "ai", text: `Let's explore the topic: ${topic}. How are you feeling about this today?` }],
    };
    journalEntries.push(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

    // Load the journaling page
    navigateTo("main-journaling");

    // Prepopulate the chat with the AI's initial response
    viewJournalEntry(newEntry);
}

function navigateToWordCloud() {
    window.location.href = '/word-cloud.html';
}

// Elements
const homePage = document.getElementById("home-page");
const wordCloudPage = document.getElementById("word-cloud-page");
const generateWordCloudButton = document.getElementById("generate-word-cloud");
const backToHomeButton = document.getElementById("back-to-home");

// Event Listeners for Navigation
generateWordCloudButton.addEventListener("click", () => {
    homePage.style.display = "none";
    wordCloudPage.style.display = "block";
});

backToHomeButton.addEventListener("click", () => {
    wordCloudPage.style.display = "none";
    homePage.style.display = "block";
});

