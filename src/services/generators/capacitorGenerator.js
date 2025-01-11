export function generateCapacitorConfig(project) {
  return {
    appId: `com.${project.name.toLowerCase().replace(/\s+/g, '')}`,
    appName: project.name,
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
      androidScheme: 'https'
    }
  };
}