# Intelligent Web Projects<link href="/import/bootstrap.min.css" rel="stylesheet">

___
## 👥 Contributor (Team 04)
* Zicong Chen 
* Yuan Gao 
* Shengchun Huang
___
## 📚 Document
* `Github`: https://github.com/gy02/plant
  * [(GitHub Name) Tommyczc](https://github.com/Tommyczc) : Zicong Chen
  * [(GitHub Name) SeanHuang99](https://github.com/SeanHuang99) : Shengchun Huang
  * [(GitHub Name) gy](https://github.com/gy02) : Yuan Gao
* Code Document: https://docs.google.com/document/d/1TL43VqVU6vnd8pYHwG6c2bPqv_FJBUwExHSrsq_uCNA/edit?usp=sharing
___

## Project Requirement
* Node: 20.11.0
* Npm: 10.2.4

---
## Database Connection (global)

###### Attention: The project use default global database, you can skip this part, but if you want to use local mongoDB server, please just change the mongoose connection string.

### MongoDB (Hosted in Microsoft Azure Cloud Server)
* `Compass Connection`:

        Login Url: mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
        Username: web04Admin
        Password: project-22558800

* `Mongoose Connection`(Path: `/controllers/databaseController/mongodbController.js`):

        const mongoose = require('mongoose');
        
        // MongoDB Atlas connection string
        const uri = 'mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
        
        mongoose.connect(uri);

___
## Installation and Running
## 📦 Install
To install dependencies for your Node.js project using the package.json file, follow these steps:

### Ensure Node.js and npm are installed:
Open your terminal or command prompt and run the following commands to check if Node.js and npm are installed:
```sh
node -v
npm -v
```
### Navigate to your project directory:
Use the cd command to navigate to the directory that contains your package.json file. For example:
```sh
cd path/to/your/project
```
### Install dependencies:
Run the following command to install all the dependencies listed in your package.json file:
```sh
npm install
```
---
## 🚀 Running
### Three Methods to Run a Node.js Project

#### I. Running the Project in WebStorm

To run a Node.js project in WebStorm:

1. **Open WebStorm and Load Your Project:**
- Launch WebStorm and open your Node.js project by selecting the project directory.

2. **Configure a Run/Debug Configuration:**
- Click on the drop-down menu in the top-right corner of the WebStorm window and select "Edit Configurations..."
- Click the "+" icon and select "Node.js" to create a new configuration.
- Set the "Node interpreter" to the path of your Node.js installation.
- Set the "Working directory" to your project root.
- Set the "JavaScript file" to your main file (e.g., `index.js`).
- Click "OK" to save the configuration.

3. **Run the Project:**
- Select the newly created configuration from the drop-down menu in the top-right corner.
- Click the green play button or press `Shift+F10` to start the project.

#### Ⅱ. Running the Project from the Command Line

To run a Node.js project from the command line:

1. **Open Terminal or Command Prompt:**
- Open your terminal (macOS/Linux) or command prompt (Windows).

2. **Navigate to Your Project Directory:**
```sh
cd path/to/your/project
```
```shell
npm start
```
#### Ⅲ. Running the Project Deployed on a Cloud Server

To access and run a Node.js project deployed on a cloud server, you can simply visit the provided URL:

**Open a Web Browser:**

- Launch your preferred web browser.

**Enter the URL:**

- Navigate to the URL of the deployed project. There are global test web addresses:
  - [https://intelligentwebteam04.net/](https://intelligentwebteam04.net/)
  - [https://sheffileldweb.vercel.app/](https://sheffileldweb.vercel.app/)

**Interact with the Application:**

- The application should be running and accessible through the web interface. The main page should as the picture below:
![](./Screenshots/main.png)


