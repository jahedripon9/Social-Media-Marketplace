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

## 🚧 Features in Development

* Complete listing creation and update functionality
* Listing details page
* Search and filtering
* Advanced marketplace filters
* User profile management
* Buying and selling workflow
* Backend/API integration
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

### Development Tools

* **ESLint**
* **Vite**
* **Git & GitHub**

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
* [ ] Complete listing CRUD
* [ ] Backend integration
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
