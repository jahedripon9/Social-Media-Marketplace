# Social Media Marketplace

A modern marketplace platform for buying and selling social media accounts.

> 🚧 **Project Status: Work in Progress**
>
> This project is currently under active development. Some features are still being implemented.

## 📌 About the Project

**Social Media Marketplace** is a web application designed to provide a platform where users can list, browse, and manage social media accounts available for sale.

The project is being developed with a focus on a clean, responsive, and user-friendly marketplace experience.

## ✨ Current Features

* User authentication with Clerk
* Social media account listing management
* Create and edit listing functionality
* Platform-based account information
* Followers and engagement information
* Monthly views
* Niche selection
* Price information
* Country and audience age range
* Verified and monetized account status
* Multiple image upload support
* Toast notifications
* Loading states
* Responsive UI
* Real-time chat functionality
* Chat message handling
* User-to-user chat based on listings
* User synchronization between Clerk and Prisma
* Listing ownership validation
* Backend API integration with Express and Prisma
* Image upload and storage handling

## 🧩 Problems I Solved During Development

While developing the project, I encountered several backend, database, authentication, and frontend integration issues. I debugged and fixed these issues by checking the error messages, tracing the data flow, and verifying the Prisma and Clerk relationships.

### 1. Prisma Enum Validation Error

When creating a listing, Prisma rejected the `niche` value because the database field was defined as a Prisma enum.

```text
Invalid value for argument `niche`. Expected Niche.
```

I traced the error to the mismatch between the frontend string value and the Prisma `Niche` enum and adjusted the data handling to match the Prisma schema.

### 2. Missing Prisma Relation During Chat Creation

While creating a chat, Prisma reported:

```text
Argument `ownerUser` is missing.
```

The problem was related to the Prisma relation between `Chat` and `User`. I checked the schema and the generated Prisma validation error and corrected the way the user relationship was handled during chat creation.

### 3. Foreign Key Constraint Error

After fixing the relation issue, chat creation produced:

```text
Foreign key constraint violated on the constraint: `Chat_chatUserId_fkey`
```

I traced the problem to the fact that the authenticated Clerk user ID did not always have a corresponding user record in Prisma.

I verified the Clerk user ID against the Prisma database and fixed the user synchronization flow so that authenticated users are properly available in the database before being used in chat and listing relationships.

### 4. Clerk User Synchronization with Prisma

I implemented and debugged Inngest functions for synchronizing Clerk users with Prisma.

The system handles:

* User creation
* User updates
* User deletion
* Keeping Clerk user IDs synchronized with Prisma user IDs
* Updating user profile information such as email, name, and image

This helped resolve cases where:

```text
Clerk userId: ...
Prisma chatUser: null
```

was returned.

### 5. Missing Named Export in ES Modules

The backend failed to start with:

```text
SyntaxError: The requested module '../controllers/chatController.js'
does not provide an export named 'getAllUserChats'
```

I traced the problem to the controller export/import structure and corrected the named exports so that the route file and controller file use matching ES module exports.

### 6. Incorrect Prisma `include` Placement

I encountered this Prisma error while fetching all user chats:

```text
Unknown argument `include`.
```

The problem was that `include` had accidentally been placed inside the `where` object.

I corrected the Prisma query structure so that `where`, `include`, and `orderBy` are separate query options.

### 7. Null User Data Causing Runtime Errors

The listing controller produced:

```text
TypeError: Cannot read properties of null (reading 'earned')
```

I traced the problem by logging both the Clerk user ID and the corresponding Prisma user.

This helped identify that a Clerk user could exist while the corresponding Prisma user record was missing.

I then fixed the user synchronization/data handling so the application does not assume that the Prisma user always exists.

### 8. Preventing Users from Chatting With Their Own Listings

During chat testing, I found that the listing owner could attempt to start a chat with their own listing.

The backend now checks the listing owner before creating a chat and prevents self-chatting.

```text
You cannot chat with your own listing
```

This validation is handled on the backend instead of relying only on the frontend.

### 9. Chat Data Relationship Debugging

I also debugged the relationship between:

* Listing
* Chat
* Chat User
* Listing Owner
* Messages

I verified the Prisma relations by fetching:

```text
listing
ownerUser
chatUser
messages
```

and used the returned data to correctly display the buyer/seller information in the chat interface.

### 10. Chat Polling and API Error Debugging

The chat interface periodically requests the latest chat data from the backend.

During development, repeated `400` and `500` responses appeared in the browser console. I traced these errors from the React `ChatBox` component to the backend `getChat` controller and then to the Prisma queries.

This helped me understand how frontend API requests, Clerk authentication, backend validation, and Prisma database relationships work together.

### 11. Debugging Authentication and Database Identity

One important debugging step was comparing the authenticated Clerk ID with the database user ID.

For example:

```text
Clerk userId: user_...
Prisma chatUser: ...
Prisma ownerUser: ...
```

This helped identify whether an error was caused by authentication, missing database records, or incorrect Prisma relationships.

## 🚧 Features in Development

* Complete listing creation and update functionality
* Listing details page
* Search and filtering
* Advanced marketplace filters
* User profile management
* Buying and selling workflow
* Payment integration
* Transaction management
* Reviews and ratings
* Improved validation and security
* Final UI/UX improvements

## 🛠️ Technologies Used

### Frontend

* **React 19**
* **React DOM 19**
* **Vite 7**
* **Tailwind CSS 4**
* **React Router DOM 7**
* **Redux Toolkit**
* **React Redux**
* **Clerk Authentication**
* **Lucide React**
* **React Hot Toast**
* **date-fns**
* **JavaScript (ES Modules)**

### Backend

* **Node.js**
* **Express.js**
* **Prisma ORM**
* **PostgreSQL / Neon**
* **Clerk Authentication**
* **Inngest**
* **Multer**
* **ImageKit**
* **WebSocket support**

### Development Tools

* **ESLint**
* **Vite**
* **Git & GitHub**
* **VS Code**
* **Chrome DevTools**

## 📂 Project Structure

```text
client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js

server/
├── configs/
├── controllers/
├── middlewares/
├── prisma/
├── routes/
├── inngest/
├── server.js
└── package.json
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jahedripon9/Social-Media-Marketplace.git
```

### 2. Navigate to the client directory

```bash
cd Social-Media-Marketplace/client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `client` directory and add the required Clerk configuration.

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

> Never commit secret keys or sensitive credentials to GitHub.

### 5. Start the development server

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

### 7. Run ESLint

```bash
npm run lint
```

## 🎯 Project Goal

The goal of this project is to build a complete social media account marketplace where users can discover, list, manage, and eventually buy or sell social media accounts through a structured marketplace platform.

## 🔮 Roadmap

* [x] Initial React project setup
* [x] Clerk authentication integration
* [x] Redux setup
* [x] Listing management structure
* [x] Listing image handling
* [x] Backend API structure
* [x] Prisma database integration
* [x] Clerk and Prisma user synchronization
* [x] Chat system structure
* [x] Chat message handling
* [ ] Complete listing CRUD
* [ ] Search and filtering
* [ ] Marketplace transaction workflow
* [ ] Payment integration
* [ ] Reviews and ratings
* [ ] Production deployment

## 👨‍💻 Developer

**Jahed Ahmed Ripon**

Frontend / MERN Stack Developer

## 📄 License

This project is currently being developed as a personal project for learning and portfolio purposes.
