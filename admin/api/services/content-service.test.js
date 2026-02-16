const contentService = require('./content-service');
const fs = require('fs').promises;
const path = require('path');

const TEST_CONTENT_FILE = path.join(__dirname, '../data/content.json');
const TEST_HTML_FILE = path.join(__dirname, '../../../test-page.html');

/**
 * Basic unit tests for ContentService
 */
async function runTests() {
  console.log('Starting ContentService tests...\n');
  
  let testsPassed = 0;
  let testsFailed = 0;

  // Backup original content
  let originalContent;
  try {
    originalContent = await fs.readFile(TEST_CONTENT_FILE, 'utf8');
  } catch (error) {
    originalContent = JSON.stringify({ posts: [], pages: [], media: [] }, null, 2);
  }

  try {
    // Test 1: Create a post
    console.log('Test 1: Create a post');
    const newPost = await contentService.createPost({
      title: 'Test Post',
      content: 'This is test content',
      category: 'test'
    });
    
    if (newPost.id && newPost.title === 'Test Post' && newPost.content === 'This is test content') {
      console.log('✓ Post created successfully');
      testsPassed++;
    } else {
      console.log('✗ Post creation failed');
      testsFailed++;
    }

    // Test 2: Get all posts
    console.log('\nTest 2: Get all posts');
    const allPosts = await contentService.getAllPosts();
    if (allPosts.length > 0 && allPosts.some(p => p.id === newPost.id)) {
      console.log('✓ Retrieved all posts successfully');
      testsPassed++;
    } else {
      console.log('✗ Failed to retrieve posts');
      testsFailed++;
    }

    // Test 3: Get specific post
    console.log('\nTest 3: Get specific post');
    const retrievedPost = await contentService.getPost(newPost.id);
    if (retrievedPost && retrievedPost.id === newPost.id) {
      console.log('✓ Retrieved specific post successfully');
      testsPassed++;
    } else {
      console.log('✗ Failed to retrieve specific post');
      testsFailed++;
    }

    // Test 4: Update post
    console.log('\nTest 4: Update post');
    const updatedPost = await contentService.updatePost(newPost.id, {
      title: 'Updated Test Post',
      content: 'Updated content'
    });
    
    if (updatedPost && updatedPost.id === newPost.id && 
        updatedPost.title === 'Updated Test Post' && 
        updatedPost.updatedAt !== newPost.updatedAt) {
      console.log('✓ Post updated successfully');
      testsPassed++;
    } else {
      console.log('✗ Post update failed');
      testsFailed++;
    }

    // Test 5: Delete post
    console.log('\nTest 5: Delete post');
    const deleted = await contentService.deletePost(newPost.id);
    const postsAfterDelete = await contentService.getAllPosts();
    
    if (deleted && !postsAfterDelete.some(p => p.id === newPost.id)) {
      console.log('✓ Post deleted successfully');
      testsPassed++;
    } else {
      console.log('✗ Post deletion failed');
      testsFailed++;
    }

    // Test 6: Get non-existent post
    console.log('\nTest 6: Get non-existent post');
    const nonExistent = await contentService.getPost('non-existent-id');
    if (nonExistent === null) {
      console.log('✓ Correctly returned null for non-existent post');
      testsPassed++;
    } else {
      console.log('✗ Should return null for non-existent post');
      testsFailed++;
    }

    // Test 7: Update non-existent post
    console.log('\nTest 7: Update non-existent post');
    const updateResult = await contentService.updatePost('non-existent-id', {
      title: 'Should not work'
    });
    if (updateResult === null) {
      console.log('✓ Correctly returned null for non-existent post update');
      testsPassed++;
    } else {
      console.log('✗ Should return null for non-existent post update');
      testsFailed++;
    }

    // Test 8: Delete non-existent post
    console.log('\nTest 8: Delete non-existent post');
    const deleteResult = await contentService.deletePost('non-existent-id');
    if (deleteResult === false) {
      console.log('✓ Correctly returned false for non-existent post deletion');
      testsPassed++;
    } else {
      console.log('✗ Should return false for non-existent post deletion');
      testsFailed++;
    }

    // Test 9: Get all pages
    console.log('\nTest 9: Get all pages');
    const allPages = await contentService.getAllPages();
    if (Array.isArray(allPages)) {
      console.log(`✓ Retrieved ${allPages.length} pages successfully`);
      testsPassed++;
    } else {
      console.log('✗ Failed to retrieve pages');
      testsFailed++;
    }

    // Test 10: Create test HTML file and get it
    console.log('\nTest 10: Create test HTML file and get it');
    const testHTML = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Test Page</title>
</head>
<body>
  <h1>Test Content</h1>
  <p>This is a test page.</p>
</body>
</html>`;
    
    await fs.writeFile(TEST_HTML_FILE, testHTML, 'utf8');
    const testPage = await contentService.getPage('test-page.html');
    
    if (testPage && testPage.filename === 'test-page.html' && 
        testPage.title === 'Test Page' && testPage.content.includes('Test Content')) {
      console.log('✓ Retrieved test page successfully');
      testsPassed++;
    } else {
      console.log('✗ Failed to retrieve test page');
      testsFailed++;
    }

    // Test 11: Update page with valid HTML
    console.log('\nTest 11: Update page with valid HTML');
    const updatedHTML = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Updated Test Page</title>
</head>
<body>
  <h1>Updated Content</h1>
  <p>This page has been updated.</p>
</body>
</html>`;
    
    const updatedPage = await contentService.updatePage('test-page.html', updatedHTML);
    
    if (updatedPage && updatedPage.title === 'Updated Test Page' && 
        updatedPage.content.includes('Updated Content')) {
      console.log('✓ Page updated successfully');
      testsPassed++;
    } else {
      console.log('✗ Failed to update page');
      testsFailed++;
    }

    // Test 12: Validate HTML structure is preserved
    console.log('\nTest 12: Validate HTML structure is preserved');
    const retrievedUpdatedPage = await contentService.getPage('test-page.html');
    
    if (retrievedUpdatedPage && 
        retrievedUpdatedPage.content.includes('<html') &&
        retrievedUpdatedPage.content.includes('</html>') &&
        retrievedUpdatedPage.content.includes('<head') &&
        retrievedUpdatedPage.content.includes('</head>') &&
        retrievedUpdatedPage.content.includes('<body') &&
        retrievedUpdatedPage.content.includes('</body>')) {
      console.log('✓ HTML structure preserved correctly');
      testsPassed++;
    } else {
      console.log('✗ HTML structure not preserved');
      testsFailed++;
    }

    // Test 13: Reject invalid HTML (missing html tags)
    console.log('\nTest 13: Reject invalid HTML (missing html tags)');
    const invalidHTML1 = '<div>Invalid HTML</div>';
    try {
      await contentService.updatePage('test-page.html', invalidHTML1);
      console.log('✗ Should have rejected invalid HTML');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('HTML måste innehålla')) {
        console.log('✓ Correctly rejected invalid HTML');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Test 14: Reject invalid HTML (unbalanced tags)
    console.log('\nTest 14: Reject invalid HTML (unbalanced tags)');
    const invalidHTML2 = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Invalid Page</title>
</head>
<body>
  <div>
    <p>Unclosed paragraph
  </div>
</body>
</html>`;
    
    try {
      await contentService.updatePage('test-page.html', invalidHTML2);
      console.log('✗ Should have rejected unbalanced HTML');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('Obalanserade HTML-taggar')) {
        console.log('✓ Correctly rejected unbalanced HTML');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Test 15: Reject path traversal attempts
    console.log('\nTest 15: Reject path traversal attempts');
    try {
      await contentService.getPage('../../../etc/passwd');
      console.log('✗ Should have rejected path traversal');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('Ogiltigt filnamn')) {
        console.log('✓ Correctly rejected path traversal');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Test 16: Get non-existent page
    console.log('\nTest 16: Get non-existent page');
    const nonExistentPage = await contentService.getPage('non-existent.html');
    if (nonExistentPage === null) {
      console.log('✓ Correctly returned null for non-existent page');
      testsPassed++;
    } else {
      console.log('✗ Should return null for non-existent page');
      testsFailed++;
    }

    // Test 17: Update non-existent page
    console.log('\nTest 17: Update non-existent page');
    const validHTML = `<!DOCTYPE html>
<html lang="sv">
<head>
  <title>Test</title>
</head>
<body>
  <p>Test</p>
</body>
</html>`;
    
    const updateNonExistent = await contentService.updatePage('non-existent.html', validHTML);
    if (updateNonExistent === null) {
      console.log('✓ Correctly returned null for non-existent page update');
      testsPassed++;
    } else {
      console.log('✗ Should return null for non-existent page update');
      testsFailed++;
    }

    // Test 18: Update CSS style - existing property
    console.log('\nTest 18: Update CSS style - existing property');
    const testCSSFile = path.join(__dirname, '../../../ribegatan.se/css/swglobal.css');
    let originalCSS;
    try {
      originalCSS = await fs.readFile(testCSSFile, 'utf8');
      
      // Update an existing property
      await contentService.updateStyle('body', 'color', '#ff0000');
      
      const updatedCSS = await fs.readFile(testCSSFile, 'utf8');
      if (updatedCSS.includes('color:#ff0000;') && updatedCSS.includes('body')) {
        console.log('✓ CSS property updated successfully');
        testsPassed++;
      } else {
        console.log('✗ Failed to update CSS property');
        testsFailed++;
      }
      
      // Restore original CSS
      await fs.writeFile(testCSSFile, originalCSS, 'utf8');
    } catch (error) {
      console.log('✗ CSS update test failed:', error.message);
      testsFailed++;
      if (originalCSS) {
        await fs.writeFile(testCSSFile, originalCSS, 'utf8');
      }
    }

    // Test 19: Update CSS style - add new property to existing selector
    console.log('\nTest 19: Update CSS style - add new property to existing selector');
    try {
      originalCSS = await fs.readFile(testCSSFile, 'utf8');
      
      // Add a new property to existing selector
      await contentService.updateStyle('body', 'border', '1px solid black');
      
      const updatedCSS = await fs.readFile(testCSSFile, 'utf8');
      if (updatedCSS.includes('border:1px solid black;') && updatedCSS.includes('body')) {
        console.log('✓ New CSS property added successfully');
        testsPassed++;
      } else {
        console.log('✗ Failed to add new CSS property');
        testsFailed++;
      }
      
      // Restore original CSS
      await fs.writeFile(testCSSFile, originalCSS, 'utf8');
    } catch (error) {
      console.log('✗ CSS add property test failed:', error.message);
      testsFailed++;
      if (originalCSS) {
        await fs.writeFile(testCSSFile, originalCSS, 'utf8');
      }
    }

    // Test 20: Update CSS style - create new selector
    console.log('\nTest 20: Update CSS style - create new selector');
    try {
      originalCSS = await fs.readFile(testCSSFile, 'utf8');
      
      // Create a new selector
      await contentService.updateStyle('.test-class', 'color', '#00ff00');
      
      const updatedCSS = await fs.readFile(testCSSFile, 'utf8');
      if (updatedCSS.includes('.test-class') && updatedCSS.includes('color:#00ff00;')) {
        console.log('✓ New CSS selector created successfully');
        testsPassed++;
      } else {
        console.log('✗ Failed to create new CSS selector');
        testsFailed++;
      }
      
      // Restore original CSS
      await fs.writeFile(testCSSFile, originalCSS, 'utf8');
    } catch (error) {
      console.log('✗ CSS create selector test failed:', error.message);
      testsFailed++;
      if (originalCSS) {
        await fs.writeFile(testCSSFile, originalCSS, 'utf8');
      }
    }

    // Test 21: Reject invalid CSS file path
    console.log('\nTest 21: Reject invalid CSS file path');
    try {
      await contentService.updateStyle('body', 'color', '#000000', '../../../etc/passwd');
      console.log('✗ Should have rejected path traversal in CSS file');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('Ogiltigt CSS-filnamn')) {
        console.log('✓ Correctly rejected path traversal in CSS file');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Test 22: Reject invalid CSS selector
    console.log('\nTest 22: Reject invalid CSS selector');
    try {
      await contentService.updateStyle('', 'color', '#000000');
      console.log('✗ Should have rejected empty selector');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('Ogiltig CSS-selektor')) {
        console.log('✓ Correctly rejected invalid selector');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Test 23: Reject non-existent CSS file
    console.log('\nTest 23: Reject non-existent CSS file');
    try {
      await contentService.updateStyle('body', 'color', '#000000', 'non-existent.css');
      console.log('✗ Should have rejected non-existent CSS file');
      testsFailed++;
    } catch (error) {
      if (error.message.includes('kunde inte hittas')) {
        console.log('✓ Correctly rejected non-existent CSS file');
        testsPassed++;
      } else {
        console.log('✗ Wrong error message:', error.message);
        testsFailed++;
      }
    }

    // Clean up test HTML file
    try {
      await fs.unlink(TEST_HTML_FILE);
    } catch (error) {
      // Ignore cleanup errors
    }

  } finally {
    // Restore original content
    await fs.writeFile(TEST_CONTENT_FILE, originalContent, 'utf8');
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Tests passed: ${testsPassed}`);
  console.log(`Tests failed: ${testsFailed}`);
  console.log('='.repeat(50));

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
