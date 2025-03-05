# Lost and Found Management System

This system is a **Spring Boot + Java + MySQL** web application designed for managing lost and found items. Users can register, log in, and report lost or found items. The system is structured with a **backend** for handling business logic and a **frontend** for user interaction.

---

## 1. Cloning the Project from GitHub

To download the project, follow these steps:

### **Option 1: Clone via Git Terminal**
1. Open a terminal.
2. Run:
   ```bash
   git clone <repository_url>
   ```
   Replace `<repository_url>` with the actual GitHub repository link.
3. Open the project in **VS Code**.

### **Option 2: Download as ZIP**
1. Visit the GitHub repository.
2. Click **Code** and select **Download ZIP**.
3. Extract the ZIP file to a directory on your PC.
4. Open the project folder in **VS Code**.

---

## 2. Required Software and Setup

Before running the project, install the following:

- **Java Development Kit (JDK) 17+**  
  - Download from [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html).

- **Spring Boot**  
  - Already included via `pom.xml`.

- **MySQL Server**  
  - Required to store user and lost/found item data.

- **VS Code Extensions**  
  Install the following in **VS Code**:
  - **Live Server** (for running the frontend).
  - **Spring Boot Extension Pack** (for backend development).
  - **Java Extension Pack** (for Java support).
  - **Lombok Annotations Support for VS Code**

---

## 3. Setting Up the Database (MySQL)

1. Start **MySQL Server**.
2. Open **MySQL Workbench** or a terminal.
3. Import the provided SQL file (`lostandfounddb_mysql`), which contains all required tables queries.
4. Verify that the tables have been created:
   ```sql
   USE LostandFoundDB;
   SHOW TABLES;
   ```

---

## 4. Running the Backend (Spring Boot)

The backend is located in **`com.example.LostAndFound`**, which includes:
- `config` (security and database settings)
- `dto` (data transfer objects)
- `entity` (database models)
- `repository` (database interaction)
- `service` (business logic)

### **Steps to Run the Backend:**
1. Open **VS Code** and load the project.
2. Open `application.properties` and configure database settings:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/LostandFoundDB?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
   Replace: root with your MySQL username, and your_password with your MySQL password.

3. Run the backend:
   - In **VS Code**, open the main class (`LostAndFoundApplication.java`).
   - Click **Run** or execute this command in directory containing pom.xml:
     ```bash
     mvn spring-boot:run
     ```
   - If you don't have MAVEN installed, or it gives an error, **Run** or execute:
    ```bash
    ./mvnw spring-boot:run 
    ```
4. The backend should now be running on `http://localhost:8080`.

---

## 5. Running the Frontend

The frontend is located in **`com.example.LostAndFound.resources.static`**, containing:
- **CSS folder** (styling)
- **JS folder** (JavaScript functionality)
- **Pictures folder** (images)

### **Steps to Run the Frontend:**
1. Open the **VS Code** project.
2. Navigate to the `static` folder.
3. Open `front.html`.
4. Right-click and select **Open with Live Server** or open `http://localhost:8080/front.html` in your broswer.
5. The frontend should now be running.

---

## 6. Testing the Application

### **Sign Up**
- Open the sign-up page.
- Enter user details and click **Sign Up**.

### **Login**
- Open the login page.
- Enter credentials and click **Sign In**.

If login is successful, the user will be redirected to the dashboard.

---

## 7. Common Issues and Fixes

### **Backend Not Starting**
- Ensure MySQL is running.
- Verify `application.properties` has the correct database credentials.

### **Login Not Working**
- Check the browser console (`F12 > Console`).
- Ensure the backend is running.

### **Signup Not Storing Data**
- Verify the MySQL database contains the necessary tables.

---

This document provides the necessary steps to **set up and run** the Lost and Found Management System.

