export async function generateReactApp(project) {
  const files = new Map();

  // Generate main App component
  files.set('src/App.jsx', generateAppComponent(project));
  
  // Generate components
  for (const component of project.components) {
    files.set(
      `src/components/${component.name}.jsx`,
      generateComponent(component)
    );
  }

  // Generate other necessary files
  files.set('src/main.jsx', generateMainFile());
  files.set('index.html', generateIndexHtml(project));
  files.set('vite.config.js', generateViteConfig());

  return files;
}

function generateAppComponent(project) {
  return `import React from 'react';
${project.components.map(c => `import ${c.name} from './components/${c.name}';`).join('\n')}

export default function App() {
  return (
    <div className="app">
      ${project.components.map(c => `<${c.name} {...${JSON.stringify(c.props)}} />`).join('\n      ')}
    </div>
  );
}`;
}

function generateComponent(component) {
  return `import React from 'react';

export default function ${component.name}(props) {
  return (
    ${component.jsx}
  );
}`;
}

function generateMainFile() {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;
}

function generateIndexHtml(project) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})`;
}