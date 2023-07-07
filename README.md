# MERN Stack Ecommerce App

This is the backend of the Code Shop Pro, online Ecommerce App.

## Env Variables
PORT=
NODE_ENV=
MONGO_URI=
JWT_SECRET=
CLIENT=
RAZORPAY_API_KEY=
RAZORPAY_API_SECRET=
REDIRECT_ON_PAYMENT_SUCCESS=
CLD_CLOUD_NAME=
CLD_API_SECRET=
CLD_API_KEY=

create a .env file in the root directory and add the env variables. When in development mode, set the `NODE_ENV` variable to `'development'`. Use the Cloudinary cloud name, API secret and API key for `CLD_CLOUD_NAME`, `CLD_API_SECRET`, `CLD_API_KEY`respectively. `CLIENT` must be domain name of the frontend.
## Start Server
To start the server use:
(make sure you have nodemon globally installed on your system. Otherwise install it as a dev dependency)

    npm run dev

