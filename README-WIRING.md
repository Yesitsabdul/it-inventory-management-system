# Milestone 4 — Wiring Notes

## 1. Copy files into your project
```
src/auth/auth.module.ts
src/auth/auth.controller.ts
src/auth/auth.service.ts
src/auth/strategies/jwt.strategy.ts
src/auth/dto/login.dto.ts
src/common/decorators/public.decorator.ts
src/common/guards/jwt-auth.guard.ts
```

## 2. Install dependencies
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

## 3. Register the global guard in app.module.ts
```ts
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ...existing imports (DatabaseModule, all 14 entity modules, etc.)
    AuthModule,
  ],
  providers: [
    // ...existing providers
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

## 4. Add .env variables
```
JWT_SECRET=replace_with_40plus_char_random_string
JWT_EXPIRES_IN=8h
```
Generate a secret: `openssl rand -base64 48`

## 5. Assumptions to verify against your actual User entity/module
These files assume:
- `UsersModule` exports `UsersService`.
- `UsersService` has `findOne(id: number)` (likely already exists from CRUD).
- `UsersService` has `findByEmail(email: string)` — **you probably need to add this method** to your users.service.ts and users.repository query if it isn't there yet:
  ```ts
  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
  ```
- `User` entity has `id`, `email`, `password` (bcrypt hash), and `role`.
- Passwords are already hashed with bcrypt on `POST /users` and `PATCH /users/:id`. If that hashing isn't in place yet, add it in `UsersService.create()` / `update()`:
  ```ts
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  ```

## 6. After wiring, test in this order
1. `POST /auth/login` with a seeded admin user's real email/password → expect `{ access_token, user }`.
2. Hit any existing endpoint (e.g. `GET /assets`) **without** a token → expect `401 Unauthorized`.
3. Hit it again with `Authorization: Bearer <access_token>` → expect it to work as before.
4. Try `POST /auth/login` with a wrong password → expect `401` with "Invalid credentials" (not a 500, not a stack trace).

## 7. Common gotchas
- If `GET /assets` (or any route) is still open without a token: check the `APP_GUARD` provider is actually registered in `app.module.ts`, not just imported.
- If Nest throws "Cannot resolve dependency JwtStrategy" — usually means `UsersModule` isn't exporting `UsersService`, or `ConfigModule` isn't global/imported where `JwtModule.registerAsync` needs it.
- `@Public()` only works on the *handler* or *controller* level — make sure it's directly above `@Post('login')`.
