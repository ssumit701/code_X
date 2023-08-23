import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai=new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
})

app.get('/', async (req, res) => {
  res.status(200).send({
    message: "Hello from codex",
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.completions.create(
   {
     model:"text-davinci-003",
        prompt:` ${prompt}`,
        max_tokens: 3000,
        temperature: 0,
    
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedText = response.choices[0].text;

    res.status(200).send({
      bot: generatedText
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error occurred');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port http://localhost:5000');
});
