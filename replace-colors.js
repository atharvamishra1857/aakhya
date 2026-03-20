const fs = require('fs');
const path = require('path');

const dir = process.cwd();

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        if (name === 'node_modules' || name === '.next' || name === '.git') return;
        var stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.js'))) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace exact hex string brackets
    content = content.replace(/-\[#5D1224\]/gi, '-brand-maroon');
    content = content.replace(/-\[#D4AF37\]/gi, '-brand-gold');
    content = content.replace(/-\[#FDFBF7\]/gi, '-brand-cream');
    content = content.replace(/-\[#F5F2EA\]/gi, '-brand-light');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
});
