const fs = require('fs');

// Password encoding
const password = encodeURIComponent('Spoorthi@12345');
console.log('Encoded password:', password);

// Create .env file
const envContent = `MONGODB_URI=mongodb+srv://Spoorthi:${password}@locono.u84w18b.mongodb.net/locono?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
NODE_ENV=development
`;

fs.writeFileSync('.env', envContent);
console.log('\n✅ .env file created successfully!');
console.log('\nMongoDB Connection String:');
console.log(envContent.split('\n')[0]);
