/**
 * Integration test for the styles endpoint
 * Tests the PUT /api/content/styles endpoint
 */

const contentService = require('./services/content-service');
const fs = require('fs').promises;
const path = require('path');

async function testStylesEndpoint() {
  console.log('Testing updateStyle functionality...\n');
  
  const testCSSFile = path.join(__dirname, '../../ribegatan.se/css/swglobal.css');
  let originalCSS;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Backup original CSS
    originalCSS = await fs.readFile(testCSSFile, 'utf8');

    // Test 1: Update existing property
    console.log('Test 1: Update existing property (body color)');
    try {
      await contentService.updateStyle('body', 'color', '#ff0000');
      const css = await fs.readFile(testCSSFile, 'utf8');
      
      if (css.includes('body') && css.includes('color:#ff0000;')) {
        console.log('✓ Successfully updated existing property');
        testsPassed++;
      } else {
        console.log('✗ Failed to update existing property');
        testsFailed++;
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
      testsFailed++;
    }

    // Restore CSS
    await fs.writeFile(testCSSFile, originalCSS, 'utf8');

    // Test 2: Add new property to existing selector
    console.log('\nTest 2: Add new property to existing selector');
    try {
      await contentService.updateStyle('h1', 'text-decoration', 'underline');
      const css = await fs.readFile(testCSSFile, 'utf8');
      
      if (css.includes('h1') && css.includes('text-decoration:underline;')) {
        console.log('✓ Successfully added new property');
        testsPassed++;
      } else {
        console.log('✗ Failed to add new property');
        testsFailed++;
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
      testsFailed++;
    }

    // Restore CSS
    await fs.writeFile(testCSSFile, originalCSS, 'utf8');

    // Test 3: Create new selector
    console.log('\nTest 3: Create new selector');
    try {
      await contentService.updateStyle('.test-selector', 'background', '#eeeeee');
      const css = await fs.readFile(testCSSFile, 'utf8');
      
      if (css.includes('.test-selector') && css.includes('background:#eeeeee;')) {
        console.log('✓ Successfully created new selector');
        testsPassed++;
      } else {
        console.log('✗ Failed to create new selector');
        testsFailed++;
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
      testsFailed++;
    }

    // Restore CSS
    await fs.writeFile(testCSSFile, originalCSS, 'utf8');

    // Test 4: Verify other styles are preserved
    console.log('\nTest 4: Verify other styles are preserved');
    try {
      const beforeCSS = await fs.readFile(testCSSFile, 'utf8');
      const bodyColorBefore = beforeCSS.match(/body\s*\{[^}]*background-color:[^;]+;/);
      
      await contentService.updateStyle('body', 'color', '#123456');
      const afterCSS = await fs.readFile(testCSSFile, 'utf8');
      const bodyColorAfter = afterCSS.match(/body\s*\{[^}]*background-color:[^;]+;/);
      
      if (bodyColorBefore && bodyColorAfter && 
          bodyColorBefore[0] === bodyColorAfter[0]) {
        console.log('✓ Other styles preserved correctly');
        testsPassed++;
      } else {
        console.log('✗ Other styles were modified');
        testsFailed++;
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
      testsFailed++;
    }

    // Restore CSS
    await fs.writeFile(testCSSFile, originalCSS, 'utf8');

    // Test 5: Handle complex selectors
    console.log('\nTest 5: Handle complex selectors');
    try {
      await contentService.updateStyle('a:hover', 'color', '#ff00ff');
      const css = await fs.readFile(testCSSFile, 'utf8');
      
      if (css.includes('a:hover') && css.includes('color:#ff00ff;')) {
        console.log('✓ Successfully handled complex selector');
        testsPassed++;
      } else {
        console.log('✗ Failed to handle complex selector');
        testsFailed++;
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
      testsFailed++;
    }

    // Final restore
    await fs.writeFile(testCSSFile, originalCSS, 'utf8');

  } catch (error) {
    console.error('Test setup failed:', error);
    if (originalCSS) {
      await fs.writeFile(testCSSFile, originalCSS, 'utf8');
    }
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Tests passed: ${testsPassed}`);
  console.log(`Tests failed: ${testsFailed}`);
  console.log('='.repeat(50));

  process.exit(testsFailed > 0 ? 1 : 0);
}

testStylesEndpoint().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
