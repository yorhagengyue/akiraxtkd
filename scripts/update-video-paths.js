/**
 * Update video paths in all pattern pages to match actual video files
 */

const fs = require('fs');
const path = require('path');

// Mapping of pattern IDs to actual video filenames
const videoMapping = {
  'preliminary': 'preliminary-poomsae.mp4',
  'taeguek-il-jang': 'taeguek-il-1-jang.mp4',
  'taeguek-e-jang': 'taeguek-e-2-jang.mp4',
  'taeguek-sam-jang': 'taeguek-sam-3-jang.mp4',
  'taeguek-sa-jang': 'taeguek-sa-4-jang.mp4',
  'taeguek-o-jang': 'taeguek-o-5-jang.mp4',
  'taeguek-yuk-jang': 'taeguek-yuk-6-jang.mp4',
  'taeguek-chil-jang': 'taeguek-chil-7-jang.mp4',
  'taeguek-pal-jang': 'taeguek-pal-8-jang.mp4'
};

// Update each pattern page
Object.keys(videoMapping).forEach(patternId => {
  const filePath = path.join(__dirname, '..', 'app', 'patterns', patternId, 'page.tsx');
  const videoFileName = videoMapping[patternId];
  
  if (fs.existsSync(filePath)) {
    console.log(`Updating: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the video path
    const oldVideoPath = `/clips/${patternId}.mp4`;
    const newVideoPath = `/clips/${videoFileName}`;
    
    content = content.replace(oldVideoPath, newVideoPath);
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${patternId} video path to ${videoFileName}`);
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('Video path update complete!');
