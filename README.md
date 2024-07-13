Welcome to the web scraping demo repository. In this repository, I have coded a backend server capable of web scraping, and storing that data in a database.

### API
For developing the API, I have used Node.js with the Node Package Manager (NPM). Also, I have written down the code in JavaScript as opposed to TypeScript.

The API can be accessed from here:<br>
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/27496888-1da196c3-6aed-4c2f-8fe3-6108ffa08814?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D27496888-1da196c3-6aed-4c2f-8fe3-6108ffa08814%26entityType%3Dcollection%26workspaceId%3D2bf9ba9f-dce8-4687-99ef-23fe5c15a33c)

### Edge Function
For the Supabase edge function, I have used TypeScript, that is JavaScript with a type framework added to it. This is because Supabase requires its edge functions to be written in TypeScript, and also use the Deno Package Manager. Instead of downloading the actual packages, I just have to reference them with a link.

### Database
I have used Supabase as the database to store the scraper configuration and output, and the platofrm for running the scraper edge function.

In Supabase, I set up 2 tables, one for storing the scraper configuration (name, uid, url, selectors), and another table for storing the bucket link to the output data, the time at which it was generated, and the scraper it belongs to (scraper id was a foreign key that linked to the corresponding scraper in the scraper configuration table). I then setup email and password authentication and created a bucket for storing the scraper outputs.
