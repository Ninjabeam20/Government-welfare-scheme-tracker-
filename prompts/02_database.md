@GEMINI.md @PROJECT_CONTEXT.md @DB_SCHEMA.md

ROLE: Act as a MySQL database administrator.

TASK: Get the MySQL database running correctly on Mac.

IMPLEMENT:
1. /backend/db.js — MySQL connection pool:
   - Use mysql2 package (not mysql)
   - Read credentials from .env
   - Export pool for use in all routes
   - Handle connection errors gracefully
   - Log "Database connected" on success

2. Verify .env has all DB variables:
   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT

3. Write the exact terminal commands to:
   - Import welfare_system.sql on Mac
   - Verify all 6 tables exist
   - Verify test data is present

4. Update package.json dependencies:
   - mysql2
   - express
   - cors
   - dotenv
   - express-session
   - passport
   - passport-google-oauth20
   - axios (frontend)

COMMANDS TO RUN:
- npm install (backend)
- MySQL import command for Mac

STOP CONDITIONS:
- db.js exports working pool
- All 6 tables confirmed in welfare_system
- Test data (1 admin, 1 officer, 1 citizen, 2 schemes) present