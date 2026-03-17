@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md

ROLE: Act as a full-stack integration engineer.

TASK: Final integration pass — ensure all three portals 
work together as one system end-to-end.

VERIFY AND FIX:

1. Full citizen flow:
   Login → BrowseSchemes → Apply → 
   TrackStatus shows "Pending" → 
   Officer approves → TrackStatus shows "Approved"

2. Full officer flow:
   Login → VerificationQueue shows new applications →
   Approve → application disappears from queue →
   Citizen timeline updates

3. Full admin flow:
   Login → Create new scheme →
   Scheme appears in citizen BrowseSchemes →
   Deactivate scheme → disappears from citizen view →
   All actions appear in AuditLogs

4. CORS and API base URL:
   - Frontend Axios baseURL = http://localhost:5000
   - Backend CORS allows http://localhost:5173
   - Both servers running simultaneously

5. Navigation consistency:
   - Every page has back/home navigation
   - Logout button on every portal header
   - No broken links anywhere

6. Error states:
   - Network error → user-friendly message
   - Unauthorized → redirect to login
   - Not found → 404 page

7. Run both servers:
   - cd backend && npm start (port 5000)
   - cd frontend && npm run dev (port 5173)
   - Provide exact commands for Mac

OUTPUT:
- List of every fix made
- Confirmation of each flow working
- Any remaining issues with suggested fixes