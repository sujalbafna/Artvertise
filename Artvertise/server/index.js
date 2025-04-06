import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = 3000;

// Initialize OpenAI client with API key directly
const openai = new OpenAI({
  apiKey: '', // Replace with your actual OpenAI API key
});

// Middleware
app.use(cors());
app.use(express.json());

async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    return {
      success: true,
      imageUrl: response.data[0].url
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const result = await generateImage(prompt);
    res.json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});