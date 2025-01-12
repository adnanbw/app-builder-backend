import { generateAndroidFiles } from './generators/androidGenerator.js';

export async function generateApp(project) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  const androidFilesPath = generateAndroidFiles(project);

  // Add Android files to archive
  archive.directory(androidFilesPath, 'android');

  // Finalize the archive
  archive.finalize();
  return archive;
}
