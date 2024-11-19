document.addEventListener('DOMContentLoaded', () => {
    // Retrieve all stored keywords
    const journalKeywords = JSON.parse(localStorage.getItem('journalKeywords')) || [];

    // Process keywords for the word cloud
    const wordFrequency = calculateWordFrequency(journalKeywords);

    // Generate word cloud
    const words = d3.layout
        .cloud()
        .size([800, 400])
        .words(
            Object.entries(wordFrequency).map(([word, count]) => ({
                text: word,
                size: 10 + count * 10,
            }))
        )
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font('Roboto')
        .fontSize((d) => d.size)
        .on('end', drawWordCloud);

    words.start();

    function drawWordCloud(words) {
        d3.select('#word-cloud-container')
            .html("") // Clear previous word cloud
            .append('svg')
            .attr('width', 800)
            .attr('height', 400)
            .append('g')
            .attr('transform', 'translate(400,200)')
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', (d) => d.size + 'px')
            .style('font-family', 'Roboto')
            .style('fill', () => `hsl(${Math.random() * 360}, 100%, 50%)`)
            .attr('text-anchor', 'middle')
            .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text((d) => d.text);
    }

    // Calculate word frequency
    function calculateWordFrequency(words) {
        const stopWords = new Set(["the", "and", "to", "of", "a", "is", "in", "it", "that", "on", "because", "bc", "but", "am", "my", "i"]); // MY UPDATED STOP WORDS
        return words
            .filter((word) => !stopWords.has(word.toLowerCase())) // Exclude stop words
            .reduce((freq, word) => {
                freq[word] = (freq[word] || 0) + 1;
                return freq;
            }, {});
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     // Retrieve journal entries from localStorage
//     const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
//     const text = journalEntries.join(' ');

//     // Generate word cloud
//     const words = d3.layout
//         .cloud()
//         .size([800, 400])
//         .words(
//             text
//                 .split(/\s+/)
//                 .map((word) => ({ text: word, size: 10 + Math.random() * 90 }))
//         )
//         .padding(5)
//         .rotate(() => ~~(Math.random() * 2) * 90)
//         .font('Roboto')
//         .fontSize((d) => d.size)
//         .on('end', drawWordCloud);

//     words.start();

//     function drawWordCloud(words) {
//         d3.select('#word-cloud-container')
//             .append('svg')
//             .attr('width', 800)
//             .attr('height', 400)
//             .append('g')
//             .attr('transform', 'translate(400,200)')
//             .selectAll('text')
//             .data(words)
//             .enter()
//             .append('text')
//             .style('font-size', (d) => d.size + 'px')
//             .style('font-family', 'Roboto')
//             .style('fill', () => `hsl(${Math.random() * 360}, 100%, 50%)`)
//             .attr('text-anchor', 'middle')
//             .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
//             .text((d) => d.text);
//     }
// });

// function navigateBack() {
//     window.location.href = '/index.html'; // Change if needed
// }
