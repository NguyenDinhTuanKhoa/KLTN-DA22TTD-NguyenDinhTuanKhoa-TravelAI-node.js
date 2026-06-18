require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const aiService = require('./src/services/aiService');

async function testAIFlow() {
  console.log('🚀 Testing TravelAI with step-3.7-flash\n');
  console.log('═'.repeat(60));

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    // Test 1: Simple chat
    console.log('Test 1: Simple chat (streaming)');
    console.log('─'.repeat(60));
    const messages1 = [
      { role: 'user', content: 'Xin chào! Giới thiệu ngắn về bạn.' }
    ];

    let response1 = '';
    await aiService.chat(messages1, (chunk) => {
      response1 += chunk;
      process.stdout.write(chunk);
    });
    console.log('\n✅ Test 1 completed\n');

    // Test 2: Travel query
    console.log('Test 2: Travel destination query');
    console.log('─'.repeat(60));
    const messages2 = [
      { role: 'user', content: 'Gợi ý 3 địa điểm du lịch nổi tiếng ở Việt Nam.' }
    ];

    let response2 = '';
    await aiService.chat(messages2, (chunk) => {
      response2 += chunk;
      process.stdout.write(chunk);
    });
    console.log('\n✅ Test 2 completed\n');

    // Test 3: Itinerary planning
    console.log('Test 3: Itinerary planning');
    console.log('─'.repeat(60));
    const messages3 = [
      { role: 'user', content: 'Tạo lịch trình du lịch Đà Nẵng 3 ngày 2 đêm.' }
    ];

    let response3 = '';
    await aiService.chat(messages3, (chunk) => {
      response3 += chunk;
      process.stdout.write(chunk);
    });
    console.log('\n✅ Test 3 completed\n');

    console.log('═'.repeat(60));
    console.log('✅ All tests passed!');
    console.log('\n📊 Summary:');
    console.log(`  - Test 1 length: ${response1.length} chars`);
    console.log(`  - Test 2 length: ${response2.length} chars`);
    console.log(`  - Test 3 length: ${response3.length} chars`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 MongoDB disconnected');
  }
}

testAIFlow();
