import { post } from 'axios';
require('dotenv').config();


async function summarizeContent(text) {
  const response = await post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "user", content: `Summarize the extracted key points:\n\n${text}` }
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      
    }
  );

  return response.data.choices[0].message.content;
}

export default { summarizeContent };
