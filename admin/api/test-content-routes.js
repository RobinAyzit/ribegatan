/**
 * Manual test script for content routes
 * Run this after starting the server to verify all endpoints work
 */

const BASE_URL = 'http://localhost:3000';

// Test credentials
const TEST_USER = {
  username: 'ADMIN',
  password: 'MINDA164!'
};

let authToken = '';

async function login() {
  console.log('🔐 Testing login...');
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER)
  });
  
  const data = await response.json();
  if (data.token) {
    authToken = data.token;
    console.log('✅ Login successful');
    return true;
  }
  console.error('❌ Login failed:', data);
  return false;
}

async function testGetPosts() {
  console.log('\n📝 Testing GET /api/content/posts...');
  const response = await fetch(`${BASE_URL}/api/content/posts`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('✅ GET posts:', data);
  return data;
}

async function testCreatePost() {
  console.log('\n📝 Testing POST /api/content/posts...');
  const newPost = {
    title: 'Test Post',
    content: '<p>This is a test post</p>',
    category: 'test'
  };
  
  const response = await fetch(`${BASE_URL}/api/content/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
  });
  
  const data = await response.json();
  console.log('✅ POST post:', data);
  return data.post;
}

async function testUpdatePost(postId) {
  console.log('\n📝 Testing PUT /api/content/posts/:id...');
  const updatedPost = {
    title: 'Updated Test Post',
    content: '<p>This post has been updated</p>'
  };
  
  const response = await fetch(`${BASE_URL}/api/content/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedPost)
  });
  
  const data = await response.json();
  console.log('✅ PUT post:', data);
  return data.post;
}

async function testDeletePost(postId) {
  console.log('\n📝 Testing DELETE /api/content/posts/:id...');
  const response = await fetch(`${BASE_URL}/api/content/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('✅ DELETE post:', data);
  return data;
}

async function testGetPages() {
  console.log('\n📄 Testing GET /api/content/pages...');
  const response = await fetch(`${BASE_URL}/api/content/pages`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('✅ GET pages:', data);
  return data;
}

async function testGetPage(filename) {
  console.log(`\n📄 Testing GET /api/content/pages/${filename}...`);
  const response = await fetch(`${BASE_URL}/api/content/pages/${filename}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('✅ GET page:', { filename: data.page?.filename, title: data.page?.title });
  return data;
}

async function testUpdateStyles() {
  console.log('\n🎨 Testing PUT /api/content/styles...');
  const styleUpdate = {
    selector: 'body',
    property: 'color',
    value: '#333333'
  };
  
  const response = await fetch(`${BASE_URL}/api/content/styles`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(styleUpdate)
  });
  
  const data = await response.json();
  console.log('✅ PUT styles:', data);
  return data;
}

async function testAuthenticationRequired() {
  console.log('\n🔒 Testing authentication requirement...');
  const response = await fetch(`${BASE_URL}/api/content/posts`);
  
  if (response.status === 401) {
    console.log('✅ Authentication correctly required (401)');
    return true;
  }
  console.error('❌ Authentication not required!');
  return false;
}

async function runTests() {
  console.log('🚀 Starting content routes tests...\n');
  
  try {
    // Test authentication requirement
    await testAuthenticationRequired();
    
    // Login
    const loginSuccess = await login();
    if (!loginSuccess) {
      console.error('❌ Cannot continue without login');
      return;
    }
    
    // Test posts endpoints
    await testGetPosts();
    const createdPost = await testCreatePost();
    if (createdPost) {
      await testUpdatePost(createdPost.id);
      await testDeletePost(createdPost.id);
    }
    
    // Test pages endpoints
    const pagesData = await testGetPages();
    if (pagesData.pages && pagesData.pages.length > 0) {
      await testGetPage(pagesData.pages[0].filename);
    }
    
    // Test styles endpoint
    await testUpdateStyles();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run tests
runTests();
