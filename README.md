# 🚆 BookTrain – Train Ticket Booking System

BookTrain is a modern Train Ticket Booking Web Application built using HTML, CSS (Tailwind), and JavaScript.  
It allows users to search trains, book tickets, generate PNR, and check booking status.

---

## 🌟 Features

- 🔍 Train Search (From → To → Date)
- 🧾 Ticket Booking System
- 🎫 Auto e-Ticket Generation
- 🔢 PNR Number Generation
- 📊 PNR Status Checking
- 📜 Booking History (local storage)
- 🎁 Coupon / Redeem System
- 🌙 Dark Mode UI
- 📱 Fully Responsive Design

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (Vanilla JS)
- SessionStorage / LocalStorage

---

## 📂 Project Structure


BookTrain/
│
├── index.html # Home Page
├── results.html # Train Search Results
├── booking.html # Passenger Details
├── payment.html # Payment Page
├── ticket.html # Ticket Display
├── pnr.html # PNR Status Check
├── history.html # Booking History
│
├── assets/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── script.js
│ └── img/


---

## 🔄 Workflow

1. User searches train from Home page
2. Selects train in Search page
3. Enters passenger details in Booking page
4. Completes payment
5. Ticket is generated with unique PNR
6. PNR can be used to check status
7. Booking saved in History

---

## 🔢 PNR System

- Unique PNR is generated using JavaScript
- Stored in `sessionStorage`
- Used to fetch ticket details in PNR page

---

## 🎁 Coupon System

- Users can apply coupon codes (e.g., SAVE50)
- Discount applied using JavaScript
- Stored in sessionStorage

---

## 👥 Team Members

- 👑 Team Leader – [Muthu Pandi]-homepage and history connect all page
- 👨‍💻 Member 1 – result and set book page
- 👨‍💻 Member 2 – booking anf ticket
- 👨‍💻 Member 3 – pnr


---

## 🚀 How to Run

1. Download or clone the repository
2. Open project folder
3. Run `index.html` in browser
4. Use Live Server (VS Code recommended)

---

## 📸 Screenshots

(Add screenshots here if needed)

---

## 🔮 Future Improvements

- Backend integration (Node.js / Firebase)
- Real-time train API
- Login / Signup system
- Payment gateway integration

---

## 📞 Contact

📧 Email: hello@BookTrain.tn  
📞 Phone: 044-2345-6789  

---

## ⭐ Conclusion

This project demonstrates a complete frontend train booking system with real-time features like PNR tracking and ticket generation.

---

**💡 Developed for academic project submission**
