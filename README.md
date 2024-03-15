# Web 04 Projects

## Document

* `Code Document`: https://docs.google.com/document/d/1TL43VqVU6vnd8pYHwG6c2bPqv_FJBUwExHSrsq_uCNA/edit?usp=sharing
* `API Document` : 
---
## Database Connection
### MongoDB (Microsoft Azure Server)
* `Compass Connection`:

        Login Url: mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
        Username: web04Admin
        Password: project-22558800

* `Mongoose Connection`: 

        const mongoose = require('mongoose');
        
        // 你的 MongoDB Atlas 连接字符串
        const uri = 'mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
        
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
