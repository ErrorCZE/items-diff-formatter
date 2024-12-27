const fs = require('fs');

function filterDiffs(filePath) {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Split the content into blocks based on double newlines
    let blocks = content.split('\n\n');
    
    // Filter out unwanted blocks
    let filteredBlocks = blocks.filter(block => {
        // Skip empty blocks
        if (!block.trim()) return false;
        
        // Check if block contains the patterns we want to remove
        const unwantedPatterns = [
            '- props - IsSecretExitRequirement',
            '- props - MetascoreGroup',
            "- props - Grids",
            "- props - WeaponRecoilSettings",
            "- props - ConflictingItems",
            "- props - Cartridges",
            "- props - Chambers",
            "- props - UniqueAnimationModID",
            "- props - magAnimationIndex",
            "- props - MergesWithChildren",
            "- props - Name",
            "- props - ShortName"
        ];
        
        // Keep the block if it doesn't contain any of the unwanted patterns
        return !unwantedPatterns.some(pattern => block.includes(pattern));
    });
    
    // Join the blocks back together with double newlines
    let newContent = filteredBlocks.join('\n\n');
    
    // Add a final newline if the content isn't empty
    if (newContent.length > 0 && !newContent.endsWith('\n')) {
        newContent += '\n';
    }
    
    // Write the filtered content back to the file
    fs.writeFileSync(filePath, newContent);
    
    // Log the number of blocks removed
    console.log(`Removed ${blocks.length - filteredBlocks.length} diff blocks`);
}

// Run the script
try {
    filterDiffs('diff.txt');
    console.log('Successfully processed diff.txt');
} catch (error) {
    console.error('Error processing file:', error.message);
}