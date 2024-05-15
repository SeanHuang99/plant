# Intelligent Web Projects 

___
## Contributor (Team 04)
* Zicong Chen 
* Yuan Gao 
* Shengchun Huang
___

## Document

* `Code Document`: https://docs.google.com/document/d/1TL43VqVU6vnd8pYHwG6c2bPqv_FJBUwExHSrsq_uCNA/edit?usp=sharing
---
## Database Connection (global)
### MongoDB (Hosted in Microsoft Azure Cloud Server)
* `Compass Connection`:

        Login Url: mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
        Username: web04Admin
        Password: project-22558800

* `Mongoose Connection`(Path://controllers/databaseController/mongodbController.js): 

        const mongoose = require('mongoose');
        
        // your MongoDB Atlas connection string
        const uri = 'mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
        
        mongoose.connect(uri);
