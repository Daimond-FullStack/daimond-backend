# daimond-backend

my-node-project/
├── src/
│   ├── connections/
│   │   ├── express.connection.js
│   │   └── mongoose.connection.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── productController.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── productModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   └── productService.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── email.js
│   ├── config/
│   │   ├── database.js
│   │   └── secrets.js
│   └── app.js
├── test/
│   ├── user.test.js
│   └── product.test.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── index.ejs
│   └── user.ejs
├── package.json
├── .gitignore
└── .env