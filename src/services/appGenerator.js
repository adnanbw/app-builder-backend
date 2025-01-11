import archiver from 'archiver';
import { generateReactApp } from './generators/reactGenerator.js';
import { generateCapacitorConfig } from './generators/capacitorGenerator.js';

export async function generateApp(project) {
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  // Generate React application files
  const reactFiles = await generateReactApp(project);
  
  // Add React files to archive
  for (const [path, content] of Object.entries(reactFiles)) {
    archive.append(content, { name: path });
  }

  // Generate Capacitor configuration
  const capacitorConfig = generateCapacitorConfig(project);
  archive.append(JSON.stringify(capacitorConfig, null, 2), { name: 'capacitor.config.json' });

  // Add other necessary files
  archive.append(generatePackageJson(project), { name: 'package.json' });
  archive.append(generateReadme(project), { name: 'README.md' });

  archive.finalize();

  return archive;
}

function generatePackageJson(project) {
  return JSON.stringify({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      '@capacitor/core': '^5.0.0',
      '@capacitor/ios': '^5.0.0',
      '@capacitor/android': '^5.0.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.0.0',
      'vite': '^4.0.0'
    },
    scripts: {
      'dev': 'vite',
      'build': 'vite build',
      'preview': 'vite preview',
      'ios': 'npm run build && npx cap sync ios && npx cap open ios',
      'android': 'npm run build && npx cap sync android && npx cap open android'
    }
  }, null, 2);
}

function generateReadme(project) {
  return `# ${project.name}

This mobile application was generated using App Builder.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Run development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`
   npm run build
   \`\`\`

4. Run on iOS/Android:
   \`\`\`
   npm run ios
   # or
   npm run android
   \`\`\`
`;