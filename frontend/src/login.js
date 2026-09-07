import { apiFetch } from './api.js';

if (localStorage.getItem('token')) { window.location.href = '/'; }

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('loginBtn');
  const errEl = document.getElementById('errorMsg');

  btn.textContent = 'Signing in...';
  btn.disabled = true;
  errEl.style.display = 'none';

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed. Please check your credentials.');
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/';
  } catch (err) {
    errEl.textContent = Array.isArray(err.message) ? err.message[0] : err.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
});
