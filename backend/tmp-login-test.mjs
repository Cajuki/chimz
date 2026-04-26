const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@medithrex.co.ke', password: 'Admin@2024' })
});
console.log('status', res.status);
console.log(await res.text());
