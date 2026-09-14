import JSZip from 'jszip';
import { Project } from '../types';

export async function downloadProjectAsZip(project: Project): Promise<void> {
  const zip = new JSZip();
  const folderName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'devforge_project';
  const rootFolder = zip.folder(folderName) || zip;

  // Add all project files
  for (const file of project.files) {
    // Handle nested file paths like "src/game/Player.js"
    rootFolder.file(file.path, file.content);
  }

  // Ensure a comprehensive README exists if not already present
  const hasReadme = project.files.some(f => f.path.toLowerCase() === 'readme.md');
  if (!hasReadme) {
    const readmeContent = `# ${project.name}

> ${project.description}

Forged with **DEVFORGE AI** — *“Describe it. Forge it.”*

## Technology Stack
- **Architecture:** ${project.technology}
- **Category:** ${project.category}
- **Status:** ${project.status}

## Project Structure
\`\`\`
${project.files.map(f => `├── ${f.path}`).join('\n')}
\`\`\`

## Getting Started
### Running Locally
1. Extract this ZIP archive into your workspace.
2. If this project contains an \`index.html\`, open it directly in any modern browser:
   \`\`\`bash
   # Or run a lightweight local static server
   npx serve .
   \`\`\`
3. If this project is a Node.js / Express service:
   \`\`\`bash
   npm install
   npm start
   \`\`\`

---
*Created on ${new Date(project.createdAt).toLocaleDateString()} with DEVFORGE AI.*
`;
    rootFolder.file('README.md', readmeContent);
  }

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
