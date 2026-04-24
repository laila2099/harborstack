# HarborStack API

i added some feautures 
Validator:Every POST/PUT request is guarded by data validation to ensure data integrity
Error Handling:The API provides clear feedback with appropriate HTTP status codes
Deterministic ID Generation:Automatic, incremental ID generation using math.max ensures unique identifiers for every new entry.
Custom Request Logger:A built-in middleware logs all incoming requests (timestamp, method, path, and client IP) to provide observability into system traffic.
Dual Response Format:The API intelligently detects the request type; it returns clean JSON for API clients and simple HTML for browser-based previews.

# run
   npm install
   cp .env.example .env
   npm run dev 
   this will show you:
   Server running on http://localhost:3000
   you can open it in the browser
   i have tested it in the browser/terminal by crul / postman
   
# urls
1-  http://localhost:3000
  this will lead you to the first page you can choose from it if u want crews or shifts
2-  http://localhost:3000/api/v1/crews/2
  this will show you the crew with id :2
3-  http://localhost:3000/api/v1/shifts/2
  this will show you the crew with id :2

  
   
