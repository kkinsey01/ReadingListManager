Start of reading list manager web app



**Node modules used**
- Express for setting up the server and API
- TypeScript for writing more structured and readable code
- Mongoose for easily interacting with MongoDB
- JsonWebToken, bcrypt, and cookieParser for authentication
- dotenv to read my API Key


What this app does:

Allows a user to keep track of the books they are reading
  - They can go to the add book page and search for a book using any combination of Author, Title, Genre. This will hit the Google Books API and return a list of matching books for the given criteria.
  - User can select a book from the list and it will add it to their account and they can view it on the home page in the overview table. It will initially have a status of "want to read." If they change it to "in progress" the entry will get moved to the currently reading table. Here, they can update their page count of how many pages they have read
  - Can delete a book at any point
