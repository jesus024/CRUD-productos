📦 Inventory Manager
📝 Overview
Inventory Manager is a web application designed to provide comprehensive inventory management for products. It offers a complete solution to handle products including creation, editing, deletion, and viewing, along with advanced search, filtering, sorting, and real-time statistics features. The app includes simulated persistence, light and dark themes, and an intuitive, responsive interface.


Link: 

https://jesus024.github.io/CRUD-productos/


🚀 Key Features
🛠️ Product Management
Add & edit: Add and modify products with essential attributes: name, quantity, price, and category.

Delete: Remove products individually or clear the entire inventory with confirmation dialogs.

Robust validation: Ensures data integrity with validations on name, quantity, price, and category.

💾 Data Persistence
Simulated local storage: Data is saved in a simulated structure mimicking localStorage.

Initial load: Loads sample products to facilitate immediate testing and use.

🎨 User Interface & Experience
Dynamic display: Products are shown as clear cards with direct actions for editing and deleting.

Notifications: Contextual messages inform about actions, errors, and confirmations.

Animations: Animated particles add an engaging visual experience.

Modals: Pop-up windows confirm critical actions to prevent mistakes.

🔍 Search, Filtering, and Sorting
Real-time search: Filters products by name instantly.

Category filtering: Displays only products of a selected category.

Flexible sorting: Sort products by name, price, or quantity.

🌗 Theme Management
Light and dark modes: Switch between themes to match preferences or environments.

Automatic theme by time: Applies dark mode during the day and light mode at night automatically.

Persistence: Saves theme settings for future sessions.

🏗️ Architecture and Design
The application uses an object-oriented approach with a main class that:

Maintains the state of products and theme settings.

Manages UI events and interactions.

Controls persistence and dynamic DOM updates.

Handles validations, rendering, and user experience management.

This modular structure promotes maintainability, scalability, and adaptability.

📊 Data Structure
Each product includes:

id: Unique identifier.

name: Descriptive name.

quantity: Inventory amount.

price: Unit price.

category: Assigned category.

createdAt: Creation date.

updatedAt (optional): Last modification date.

⚙️ Requirements & Dependencies
Modern browser supporting ES6+.

HTML structure with forms, containers, buttons, filters, and modals.

CSS styles for themes and animations.

No external libraries; uses vanilla JS for maximum compatibility.

🛡️ Technical Considerations
Simulated persistence: Currently uses global variables; real storage recommended for production.

Validations: Basic validations implemented; backend validation essential for real-world use.

Extensibility: Prepared for new categories, fields, and features.

Internationalization: Basic support in Spanish; expandable to multiple languages.

📈 Suggested Future Improvements
Real persistent storage (localStorage, IndexedDB, or APIs).

Pagination for large inventories.

Export to CSV or PDF.

Authentication and access control.

Support for images and multimedia.

Responsive design for mobile devices.


Contact:

Name: Jesus Alberto Ariza Albarez

Cc: 1129583704

Email: jaarizaa028@gmail.com

Clan: Ciénaga

Full internationalization.

🎯 Conclusion
Inventory Manager is a robust and versatile solution for efficiently managing small to medium-sized inventories. It combines essential features with a polished user experience and structured code, ideal for learning and deploying management systems.
