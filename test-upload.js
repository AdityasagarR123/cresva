import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  const form = new FormData();
  form.append('type', 'website');
  form.append('title', 'Test');
  form.append('description', 'Test desc');
  form.append('tags', 'tag1,tag2');
  
  // Create a dummy video file
  fs.writeFileSync('dummy.mp4', 'dummy content');
  form.append('video', fs.createReadStream('dummy.mp4'));
  
  fs.writeFileSync('dummy.png', 'dummy content');
  form.append('thumbnail', fs.createReadStream('dummy.png'));

  try {
    const res = await fetch('http://localhost:3000/api/works', {
      method: 'POST',
      body: form
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Network error:', err);
  }
}

testUpload();
