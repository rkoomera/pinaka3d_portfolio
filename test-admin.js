#!/usr/bin/env node

/**
 * Admin Page Test Script
 * 
 * This script tests accessing the admin page directly
 */

const http = require('http');

function checkAdminPage() {
  return new Promise((resolve) => {
    // Try different ports
    const ports = [3000, 3001, 3002, 3003];
    let checkedPorts = 0;
    
    ports.forEach(port => {
      const options = {
        hostname: 'localhost',
        port: port,
        path: '/admin',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js Admin Page Test)'
        }
      };
      
      const req = http.request(options, (res) => {
        console.log(`\n🔍 Testing admin page on port ${port}\n`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Location: ${res.headers.location || 'No redirect'}`);
        
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Successfully accessed admin page');
            // Check if the page contains admin dashboard content
            if (data.includes('Admin Dashboard')) {
              console.log('✅ Page contains Admin Dashboard content');
            } else if (data.includes('Admin Login')) {
              console.log('ℹ️ Redirected to login page');
            } else {
              console.log('❌ Page does not contain expected content');
            }
          } else if (res.statusCode === 302 || res.statusCode === 307) {
            console.log(`ℹ️ Redirected to: ${res.headers.location}`);
          } else {
            console.log('❌ Failed to access admin page');
          }
          
          checkedPorts++;
          if (checkedPorts === ports.length) {
            resolve();
          }
        });
      });
      
      req.on('error', (error) => {
        console.log(`\n🔍 Testing admin page on port ${port}\n`);
        console.log(`❌ Error: ${error.message}`);
        checkedPorts++;
        if (checkedPorts === ports.length) {
          resolve();
        }
      });
      
      req.setTimeout(5000, () => {
        console.log(`\n🔍 Testing admin page on port ${port}\n`);
        console.log('❌ Request timed out');
        req.abort();
        checkedPorts++;
        if (checkedPorts === ports.length) {
          resolve();
        }
      });
      
      req.end();
    });
  });
}

console.log('\n🔍 Testing access to admin page\n');
checkAdminPage(); 