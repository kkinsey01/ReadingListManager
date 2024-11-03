Start of reading list manager web app



**Node modules used**
- Express for setting up the server and API
- TypeScript for writing more structured and readable code
- Mongoose for easily interacting with MongoDB
- JsonWebToken, bcrypt, and cookieParser for authentication
- dotenv to read my API Key


Flow of the app:

Once user's login is verified, they go to the home page where they can view current books status and update what they need to. Some options could be that they want to read, have read, or started reading a book. If they are currently in progress of reading a book, it will also be in another table that will show their current page (manually update). If a book isn't in any of the home page lists, they can go to the add book page. They will enter any of 3 options between title, author, and category. It'll send a request to my server, which will send a request to the Google Books API to retrieve a list of books matching what the user entered. From there, the user can select a book to add to their profile. 
