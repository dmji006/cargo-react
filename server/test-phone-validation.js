const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testPhoneValidation() {
    try {
        console.log('\n1. Testing invalid phone number format:');
        try {
            await axios.post(`${API_URL}/auth/send-verification`, {
                mobileNumber: '1234567890' // Invalid format
            });
            console.log('❌ Test failed: Invalid phone number was accepted');
        } catch (error) {
            if (error.response) {
                console.log('✓ Invalid phone number rejected:', error.response.data.message);
            } else if (error.code === 'ECONNREFUSED') {
                console.error('❌ Error: Server is not running. Please start the server first.');
                process.exit(1);
            } else {
                console.error('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n2. Testing valid phone number:');
        let token;
        try {
            const sendVerificationResponse = await axios.post(`${API_URL}/auth/send-verification`, {
                mobileNumber: '09123456789'
            });
            console.log('✓ Verification code sent:', sendVerificationResponse.data);
            token = sendVerificationResponse.data.token;
        } catch (error) {
            console.error('❌ Error sending verification:', error.response?.data?.message || error.message);
            process.exit(1);
        }

        console.log('\n3. Testing invalid verification code:');
        try {
            await axios.post(`${API_URL}/auth/verify-phone`, {
                token,
                verificationCode: '000000'
            });
            console.log('❌ Test failed: Invalid verification code was accepted');
        } catch (error) {
            console.log('✓ Invalid verification code rejected:', error.response?.data?.message);
        }

        console.log('\n4. Testing invalid token:');
        try {
            await axios.post(`${API_URL}/auth/verify-phone`, {
                token: 'invalid_token',
                verificationCode: '123456'
            });
            console.log('❌ Test failed: Invalid token was accepted');
        } catch (error) {
            console.log('✓ Invalid token rejected:', error.response?.data?.message);
        }

        console.log('\n5. Testing without token:');
        try {
            await axios.post(`${API_URL}/auth/verify-phone`, {
                verificationCode: '123456'
            });
            console.log('❌ Test failed: Missing token was accepted');
        } catch (error) {
            console.log('✓ Missing token rejected:', error.response?.data?.message);
        }

        console.log('\n6. Testing without verification code:');
        try {
            await axios.post(`${API_URL}/auth/verify-phone`, {
                token
            });
            console.log('❌ Test failed: Missing verification code was accepted');
        } catch (error) {
            console.log('✓ Missing verification code rejected:', error.response?.data?.message);
        }

        console.log('\nℹ️ For testing successful verification:');
        console.log('1. Check the server console for the actual verification code');
        console.log('2. Use the following command with the actual code:');
        console.log(`
curl -X POST http://localhost:5000/api/auth/verify-phone \\
  -H "Content-Type: application/json" \\
  -d '{"token": "${token}", "verificationCode": "ACTUAL_CODE"}'
        `);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testPhoneValidation(); 