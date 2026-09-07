import * as bcrypt from 'bcrypt';
async function test() {
  const hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const passwords = ['password', 'Admin123!', 'admin', 'admin123'];
  for (const p of passwords) {
    const res = await bcrypt.compare(p, hash);
    console.log(`Password: ${p} -> ${res}`);
  }
}
test().catch(console.error);
