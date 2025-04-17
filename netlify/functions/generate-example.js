const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  const { words, meanings } = JSON.parse(event.body);

  const prompt = `다음 단어들 중 최소 40% 이상을 사용해서 자연스러운 영어 지문을 하나 만들어줘. 
단어: ${words.map((w, i) => `${w} (${meanings[i]})`).join(', ')}`;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.data.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get GPT response" }),
    };
  }
};
