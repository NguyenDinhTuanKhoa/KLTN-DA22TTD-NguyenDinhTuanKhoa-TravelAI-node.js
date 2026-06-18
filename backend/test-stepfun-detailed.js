require('dotenv').config({ path: '.env' });
const OpenAI = require('openai');

const nvidiaClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
  timeout: 60 * 1000,
});

async function testStepFun() {
  console.log('🧪 Testing stepfun-ai/step-3.7-flash with different configs\n');

  // Test 1: Basic
  console.log('Test 1: Basic configuration');
  try {
    const response = await nvidiaClient.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',
      messages: [
        { role: 'user', content: 'Hãy giới thiệu 3 địa điểm du lịch nổi tiếng ở Việt Nam.' }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('✅ Response:', response.choices[0]?.message?.content || 'Empty');
    console.log('Full response object:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 2: Streaming
  console.log('Test 2: Streaming mode');
  try {
    const stream = await nvidiaClient.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',
      messages: [
        { role: 'user', content: 'Giới thiệu ngắn về Hà Nội.' }
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || '';
      fullText += content;
      if (content) process.stdout.write(content);
    }
    console.log('\n✅ Streaming successful! Total length:', fullText.length);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 3: Simple English prompt
  console.log('Test 3: English prompt');
  try {
    const response = await nvidiaClient.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',
      messages: [
        { role: 'user', content: 'What is 2+2?' }
      ],
      max_tokens: 100,
    });

    console.log('✅ Response:', response.choices[0]?.message?.content || 'Empty');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testStepFun().catch(console.error);
