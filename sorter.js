const fs = require('fs');

function groupPropChanges(filePath) {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Split the content into blocks based on double newlines
    let blocks = content.split('\n\n').filter(block => block.trim());
    
    // Object to store groups of changes
    let changeGroups = {};
    
    blocks.forEach(block => {
        // Check if this is a property change block (contains " - props - ")
        if (block.includes(' - props - ')) {
            // Extract the property path (everything after " - props - ")
            const firstLine = block.split('\n')[0];
            const propPath = firstLine.split(' - props - ')[1];
            
            // If this property hasn't been seen before, create an array for it
            if (!changeGroups[propPath]) {
                changeGroups[propPath] = [];
            }
            
            // Add this block to its property group
            changeGroups[propPath].push(block);
        } else {
            // For blocks that don't match the pattern (like "Nový předmět"),
            // store them under a special key
            if (!changeGroups['other']) {
                changeGroups['other'] = [];
            }
            changeGroups['other'].push(block);
        }
    });
    
    // Combine all groups into final content
    let organizedContent = '';
    
    // First add all property changes, sorted alphabetically by property name
    Object.keys(changeGroups)
        .filter(key => key !== 'other')
        .sort()
        .forEach(propPath => {
            organizedContent += changeGroups[propPath].join('\n\n') + '\n\n';
        });
    
    // Then add any non-property changes at the end
    if (changeGroups['other']) {
        organizedContent += changeGroups['other'].join('\n\n') + '\n\n';
    }
    
    // Remove extra newlines at the end and add just one
    organizedContent = organizedContent.trim() + '\n';
    
    // Write the organized content back to the file
    fs.writeFileSync(filePath, organizedContent);
    
    // Log statistics
    console.log('Changes grouped by property:');
    for (const [propPath, blocks] of Object.entries(changeGroups)) {
        if (propPath === 'other') {
            console.log(`- Other changes: ${blocks.length}`);
        } else {
            console.log(`- ${propPath}: ${blocks.length} changes`);
        }
    }
}

// Run the script
try {
    groupPropChanges('diff.txt');
    console.log('Successfully organized diff.txt');
} catch (error) {
    console.error('Error processing file:', error.message);
}