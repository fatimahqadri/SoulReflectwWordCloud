// // import express from "express";
// // import bodyParser from "body-parser";
// // import fetch from "node-fetch";
// // import path from "path";
// // import dotenv from "dotenv";

// // // Load environment variables from .env file
// // dotenv.config();

// // // Use import.meta.url to get the current directory
// // const __dirname = path.dirname(new URL(import.meta.url).pathname);

// // const app = express();
// // const PORT = process.env.PORT || 3000;


// // // Middleware to parse JSON body
// // app.use(bodyParser.json());

// // app.use(express.static(path.join(__dirname, 'public')));

// // // Serve the index.html directly when accessing the root URL
// // app.get("/", (req, res) => {
// //     res.sendFile(path.join(__dirname, "public", "index.html"));
// // });

// // // Serve the script.js and style.css directly from the public folder
// // app.get("/script.js", (req, res) => {
// //     res.sendFile(path.join(__dirname, "public", "script.js"));
// // });

// // app.get("/style.css", (req, res) => {
// //     res.sendFile(path.join(__dirname, "public", "style.css"));
// // });

// // // app.post("/chat", async (req, res) => {
// // //     const { message } = req.body;
// // //     try {
// // //         const response = await fetch("https://api.openai.com/v1/chat/completions", {
// // //             method: "POST",
// // //             headers: {
// // //                 "Content-Type": "application/json",
// // //                 "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
// // //             },
// // //             body: JSON.stringify({
// // //                 model: "gpt-3.5-turbo",
// // //                 messages: [
// // //                     {
// // //                         role: "system",
// // //                         content: "You are SoulReflect, an AI journaling assistant dedicated solely to helping users explore their emotions and thoughts. Focus on therapeutic journaling guidance. Respond in a supportive, conversational tone and avoid long responses. Instead, engage users with questions and short reflections to facilitate a meaningful, interactive journaling experience."
// // //                     },
// // //                     { role: "user", content: message }
// // //                 ],
// // //                 max_tokens: 100  // Set token limit to keep responses concise
// // //             }),
// // //         });

// // //         const data = await response.json();
// // //         const botMessage = data.choices[0].message.content;
// // //         res.json({ response: botMessage });
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ response: "Sorry, something went wrong!" });
// // //     }
// // // });

// // app.post("/chat", async (req, res) => {
// //     const { message } = req.body;

// //     // Keywords to detect farewells
// //     const farewellKeywords = ["thank you", "I'm good", "all set", "done for now", "goodbye", "that's all", "thanks"];
// //     const isFarewell = farewellKeywords.some(keyword => message.toLowerCase().includes(keyword));

// //     try {
// //         const systemMessage = {
// //             role: "system",
// //             content: "You are SoulReflect, an empathetic and conversational journaling assistant. Provide thoughtful and concise responses in a supportive tone. Engage the user with reflective questions and warm feedback. Recognize when the user indicates the conversation is over, and respond with a kind farewell."
// //         };

// //         const userMessage = { role: "user", content: message };

// //         const responsePayload = {
// //             model: "gpt-3.5-turbo",
// //             messages: isFarewell
// //                 ? [systemMessage, userMessage, { role: "assistant", content: "Thank you for sharing today. Take care, and come back whenever you're ready to reflect more!" }]
// //                 : [systemMessage, userMessage],
// //             max_tokens: 200, // Increased token limit for longer, engaging responses
// //         };

// //         const response = await fetch("https://api.openai.com/v1/chat/completions", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
// //             },
// //             body: JSON.stringify(responsePayload),
// //         });

// //         const data = await response.json();
// //         const botMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Let's try again!";

// //         res.json({ response: botMessage });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ response: "Sorry, something went wrong!" });
// //     }
// // });


// // // app.post("/chat", async (req, res) => {
// // //     const { message } = req.body;
// // //     try {
// // //         const response = await fetch("https://api.openai.com/v1/chat/completions", {
// // //             method: "POST",
// // //             headers: {
// // //                 "Content-Type": "application/json",
// // //                 "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
// // //             },
// // //             body: JSON.stringify({
// // //                 model: "gpt-3.5-turbo",
// // //                 messages: [{ role: "user", content: message }],
// // //             }),
// // //         });

// // //         const data = await response.json();
// // //         const botMessage = data.choices[0].message.content;
// // //         res.json({ response: botMessage });
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ response: "Sorry, something went wrong!" });
// // //     }
// // // });

// // // Start the server and listen on the specified port
// // // app.listen(PORT, () => {
// // //     console.log(`Server is running on http://localhost:${PORT}`);
// // // });


// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });

// import express from "express";
// import bodyParser from "body-parser";
// import fetch from "node-fetch";
// import path from "path";
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// // Use import.meta.url to get the current directory
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse JSON body
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// // Serve the index.html directly when accessing the root URL
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Serve the script.js and style.css directly from the public folder
// app.get("/script.js", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "script.js"));
// });

// app.get("/style.css", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "style.css"));
// });

// // Endpoint to handle chat messages
// app.post("/chat", async (req, res) => {
//     const { message } = req.body;

//     // Keywords to detect farewells
//     const farewellKeywords = ["thank you", "I'm good", "all set", "done for now", "goodbye", "that's all", "thanks"];
//     const isFarewell = farewellKeywords.some(keyword => message.toLowerCase().includes(keyword));

//     try {
//         const systemMessage = {
//             role: "system",
//             content: "You are SoulReflect, an empathetic and conversational journaling assistant. Provide thoughtful and concise responses in a supportive tone. Engage the user with reflective questions and warm feedback. Recognize when the user indicates the conversation is over, and respond with a kind farewell."
//         };

//         const userMessage = { role: "user", content: message };

//         const responsePayload = {
//             model: "gpt-3.5-turbo",
//             messages: isFarewell
//                 ? [systemMessage, userMessage, { role: "assistant", content: "Thank you for sharing today. Take care, and come back whenever you're ready to reflect more!" }]
//                 : [systemMessage, userMessage],
//             max_tokens: 200, // Increased token limit for longer, engaging responses
//         };

//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//             },
//             body: JSON.stringify(responsePayload),
//         });

//         const data = await response.json();
//         const botMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Let's try again!";

//         res.json({ response: botMessage });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ response: "Sorry, something went wrong!" });
//     }
// });


// // Endpoint to handle "Give Me Summary" requests
// app.post("/summary", async (req, res) => {
//     const { messages } = req.body;

//     if (!messages || messages.length === 0) {
//         return res.status(400).json({ response: "No conversation data provided for summary." });
//     }

//     try {
//         const userMessages = messages
//             .filter(msg => msg.type === "user")
//             .map(msg => msg.text)
//             .join(" ");

//         const aiMessages = messages
//             .filter(msg => msg.type === "ai")
//             .map(msg => msg.text)
//             .join(" ");

//         const summaryPrompt = `
//             Please summarize this conversation. 
//             User's input: ${userMessages}
//             AI's advice: ${aiMessages}
//             Include the following:
//             1. Where the user started.
//             2. Any tips or guidance the AI gave.
//             3. How the user can improve or has improved.
//         `;

//         const responsePayload = {
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: "You are a helpful assistant summarizing a journaling session for the user." },
//                 { role: "user", content: summaryPrompt },
//             ],
//             max_tokens: 250, // Adjust token limit for detailed responses
//         };

//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//             body: JSON.stringify(responsePayload),
//         });

//         const data = await response.json();
//         const summary = data.choices[0]?.message?.content || "Sorry, I couldn't generate a summary. Please try again.";

//         res.json({ response: summary });
//     } catch (error) {
//         console.error("Error generating summary:", error);
//         res.status(500).json({ response: "An error occurred while generating the summary." });
//     }
// });


// // Endpoint to fetch past journal entries
// app.get("/journal-entries", (req, res) => {
//     const journalEntries = [
//         { id: 1, title: "Entry 1", content: "This is the first journal entry." },
//         { id: 2, title: "Entry 2", content: "This is the second journal entry." },
//         { id: 3, title: "Entry 3", content: "This is the third journal entry." }
//     ];
//     res.json(journalEntries);
// });

// // Start the server and listen on the specified port
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Use import.meta.url to get the current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html directly when accessing the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve the script.js and style.css directly from the public folder
app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "script.js"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "style.css"));
});

// Endpoint to handle chat messages
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    const farewellKeywords = ["thank you", "I'm good", "all set", "done for now", "goodbye", "that's all", "thanks"];
    const isFarewell = farewellKeywords.some(keyword => message.toLowerCase().includes(keyword));

    try {
        const systemMessage = {
            role: "system",
            content: "You are SoulReflect, an empathetic and conversational journaling assistant. Provide thoughtful and concise responses in a supportive tone. Engage the user with reflective questions and warm feedback. Recognize when the user indicates the conversation is over, and respond with a kind farewell."
        };

        const userMessage = { role: "user", content: message };

        const responsePayload = {
            model: "gpt-3.5-turbo",
            messages: isFarewell
                ? [systemMessage, userMessage, { role: "assistant", content: "Thank you for sharing today. Take care, and come back whenever you're ready to reflect more!" }]
                : [systemMessage, userMessage],
            max_tokens: 200,
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(responsePayload),
        });

        const data = await response.json();
        const botMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Let's try again!";

        res.json({ response: botMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Sorry, something went wrong!" });
    }
});

// Endpoint to handle "Give Me Summary" requests
app.post("/summary", async (req, res) => {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
        return res.status(400).json({ response: "No conversation data provided for summary." });
    }

    try {
        const userMessages = messages
            .filter(msg => msg.type === "user")
            .map(msg => msg.text)
            .join(" ");

        const aiMessages = messages
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

        const responsePayload = {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant summarizing a journaling session for the user." },
                { role: "user", content: summaryPrompt },
            ],
            max_tokens: 250,
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(responsePayload),
        });

        const data = await response.json();
        const summary = data.choices[0]?.message?.content || "Sorry, I couldn't generate a summary. Please try again.";

        res.json({ response: summary });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ response: "An error occurred while generating the summary." });
    }
});

app.post("/analyze-mood", async (req, res) => {
    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ error: "No messages provided for mood analysis." });
    }

    try {
        const responsePayload = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an emotion analysis tool. Analyze the following text and provide a percentage breakdown of emotions (e.g., Happy, Sad, Angry, Neutral, Nervous). Return a JSON response."
                },
                {
                    role: "user",
                    content: messages,
                },
            ],
            max_tokens: 100,
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(responsePayload),
        });

        const data = await response.json();
        const analysis = JSON.parse(data.choices[0]?.message?.content || "{}");

        res.json({ moodAnalysis: analysis });
    } catch (error) {
        console.error("Error analyzing mood:", error);
        res.status(500).json({ error: "Failed to analyze mood." });
    }
});

app.post("/word-cloud", (req, res) => {
    const { journalEntries } = req.body;

    if (!journalEntries || !Array.isArray(journalEntries)) {
        return res.status(400).json({ error: "Invalid journal entries provided." });
    }

    // Calculate word frequency
    const wordFrequency = journalEntries.reduce((freq, entry) => {
        const words = entry.content.toLowerCase().match(/\b\w+\b/g); // Match words
        if (words) {
            words.forEach(word => {
                freq[word] = (freq[word] || 0) + 1;
            });
        }
        return freq;
    }, {});

    // Filter out common stopwords (optional)
    const stopWords = new Set([
        "the", "and", "is", "to", "in", "of", "a", "it", "that", "on", "for", "with", "as", "was", "at", "by", "an", "be", "on", "because", "bc", "but", "am", "my", "i"
    ]);

    const filteredFrequency = Object.entries(wordFrequency)
        .filter(([word]) => !stopWords.has(word))
        .sort(([, a], [, b]) => b - a); // Sort by frequency

    res.json({ wordFrequency: filteredFrequency.slice(0, 50) }); // Return top 50 words
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
