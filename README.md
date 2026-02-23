# 🎓 SVSU Events Hub – College Event Management System  

🔗 **Live Website:** https://svsueventshub.vercel.app/

---

## 📌 About the Project  

SVSU Events Hub is a full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** based College Event Management System developed to improve campus event visibility and increase student participation.

This project was developed as a **Minor Project** under the guidance of **Ms. Ritu Rana Mam (Coordinator, CS/IT Department)**.

The platform simplifies event management for **Students, Hosts, and Admins** while ensuring secure authentication, real-time database updates, and automated email notifications.

---

## 🎯 Purpose of the Project  

Our university faced low event registrations due to lack of visibility and centralized event management.

This platform aims to:

- 📢 Increase event visibility across campus  
- 📝 Simplify student registration process  
- 📊 Help hosts manage events efficiently  
- 📈 Boost overall participation in campus activities  

---

# 👥 User Roles & Features  

## 1️⃣ Student Role  

Students can:

- 🔐 Register & Login securely  
- 📅 View newly uploaded events  
- 📝 Register for any event  
- ✏️ Edit registration before event deadline  
- ❌ Delete their registration  
- 📧 Receive email notifications after actions  

---

## 2️⃣ Host Role  

Hosts can:

- ➕ Create/Host new events  
- 🖼 Upload event logo & banner  
- 📜 Add event rules & perks  
- ✏️ Modify their uploaded events  
- ❌ Delete hosted events  
- 📥 Download registered participants list in:
  - Excel format  
  - PDF format  
- 📊 View all registrations for their events  
- 📧 Receive email notifications  

---

## 3️⃣ Admin Role  

Admin can:

- 👀 View all events  
- ❌ Delete any event  
- 📊 Monitor registrations  
- 🧑‍💼 Manage hosts and platform activities  
- 📧 Receive notifications for major actions  

---

# 🔔 Email Notification System  

Email notifications are automatically triggered when:

- 📢 Host uploads an event  
- 📝 Student registers for an event  
- ❌ Admin deletes an event  
- 🔄 Registration updates occur  

This ensures transparency and real-time communication between users.

---

# 🏗️ Tech Stack  

## 🚀 Frontend  

- React.js  
- Tailwind CSS  
- Axios  
- JWT Authentication Handling  
- PDF & Excel generation libraries  

## ⚙️ Backend  

- Node.js  
- Express.js  
- MVC Architecture  
- JWT Authentication  
- Helmet (Security Middleware)  
- Passport.js (Authentication Strategy)  
- Multer (File Upload Handling)  
- Cloudinary (Image Storage)  
- Email Services Integration  
- PDF & Excel generation  

## 🗄️ Database  

- MongoDB Atlas (Cloud Database)  

---

# 🔐 Authentication & Security  

- JWT Token-based Authentication  
- Helmet for securing HTTP headers  
- Passport.js authentication strategy  
- Protected routes for each role  
- Role-based access control  

---

# 🏛️ Architecture  

The project follows **MVC Architecture**:

- **Model** → Database Schemas  
- **View** → React Frontend  
- **Controller** → Business Logic & API Handling  

---

# 🌍 Deployment  

| Service   | Platform        |
|-----------|-----------------|
| Frontend  | Vercel          |
| Backend   | Render          |
| Database  | MongoDB Atlas   |

🔗 **Live URL:**  
👉 https://svsueventshub.vercel.app/

---

# 💻 Local Development Setup  

## 1️⃣ Clone Repository  

```bash
git clone <your-repository-link>
cd svsu-events-hub

```

## 2️⃣ Backend Setup  

```bash
cd backend
npm install
node server.js
```
Backend runs on:

http://localhost:8080
```
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
```
Frontend runs on:

http://localhost:5173

📂 Key Functional Highlights

✔ Real-time database integration
✔ Cloud image storage using Cloudinary
✔ Secure file uploads using Multer
✔ Automated email notification system
✔ PDF & Excel export for hosts
✔ Role-based dashboard
✔ Clean & Responsive UI using Tailwind CSS
✔ Secure authentication & protected routes

📊 How This Website Helps

🎓 For Students

- Easy event discovery
- Quick registration process
- Better participation opportunities

🧑‍💼 For Hosts

- Simplified event management
- Downloadable participant data
- Better organization & tracking

🏫 For University

- Increased campus engagement
- Improved event participation rates
- Centralized digital event system

👨‍💻 Project Type

🎓 Minor Project – B.Tech (CS/IT)

Guided By:
Ms. Ritu Rana Mam
Coordinator, CS/IT Department

🛠 Future Enhancements

🔔 Push Notifications
📊 Event Analytics Dashboard
🎟 QR-based Attendance System
📱 Mobile App Version
💳 Online Payment Integration
📬 Contact

For collaboration, suggestions, or contributions, feel free to connect.

⭐ If you like this project, don't forget to give it a star on GitHub!


---

Now your README is fully structured and professional ✅  

If you want, I can now:  
- Add **GitHub badges (Deploy, Tech Stack, License, etc.)**  
- Add **Environment Variables (.env) section**  
- Add **API Routes documentation section**  
- Make it look like a 🔥 professional open-source project README**
