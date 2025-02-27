#!/usr/bin/env node

/**
 * Login Page Test Script
 * 
 * This script tests accessing the login page directly
 */

const http = require('http');

function checkLoginPage() {
  return new Promise((resolve) => {
    // Try different ports
    const ports = [3000, 3001, 3002, 3003];
    let checkedPorts = 0;
    
    ports.forEach(port => {
      const options = {
        hostname: 'localhost',
        port: port,
        path: '/admin/login',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js Login Page Test)'
        }
      };
      
      const req = http.request(options, (res) => {
        console.log(`\n🔍 Testing login page on port ${port}\n`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Location: ${res.headers.location || 'No redirect'}`);
        
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Successfully accessed login page');
            // Check if the page contains login form
            if (data.includes('Admin Login')) {
              console.log('✅ Page contains login form');
            } else {
              console.log('❌ Page does not contain login form');
            }
          } else if (res.statusCode === 302 || res.statusCode === 307) {
            console.log(`ℹ️ Redirected to: ${res.headers.location}`);
          } else {
            console.log('❌ Failed to access login page');
          }
          
          checkedPorts++;
          if (checkedPorts === ports.length) {
            resolve();
          }
        });
      });
      
      req.on('error', (error) => {
        console.log(`\n🔍 Testing login page on port ${port}\n`);
        console.log(`❌ Error: ${error.message}`);
        checkedPorts++;
        if (checkedPorts === ports.length) {
          resolve();
        }
      });
      
      req.setTimeout(5000, () => {
        console.log(`\n🔍 Testing login page on port ${port}\n`);
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

console.log('\n🔍 Testing access to login page\n');
checkLoginPage(); 