
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/tests.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Use a more generic regex to find question blocks
// Look for { followed by id: \d+
const blocks = content.split(/\{/);
const results = [];
let currentTest = "Unknown";

blocks.forEach((block, index) => {
    if (block.includes('slug: "')) {
        const titleMatch = block.match(/title: "(.*?)"/);
        if (titleMatch) currentTest = titleMatch[1];
    }

    if (block.includes('id:') && block.includes('text:') && block.includes('options:')) {
        const idMatch = block.match(/id:\s*(\d+)/);
        const qId = idMatch ? idMatch[1] : "unknown";

        if (!block.includes('imageUrl:')) {
            results.push({ test: currentTest, qId: qId, index: index });
        }
    }
});

console.log('--- Audit Results ---');
results.forEach(r => {
    console.log(`Test: ${r.test} | Question ID: ${r.qId}`);
});
