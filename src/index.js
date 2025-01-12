import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateApp } from './services/appGenerator.js';
import { supabase } from './services/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { projectId } = req.body;
    
    // Get project data from Supabase
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;

    // Generate the application
    const appZip = await generateApp(project);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${project.name}.zip`);
    
    // Send the zip file
    appZip.pipe(res);
  } catch (error) {
    console.error('App generation error:', error);
    res.status(500).json({ error: 'Failed to generate application' });
  }
});