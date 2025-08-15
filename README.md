# Code Blog Backend

## Overview
Backend API for the Code Blog application, built with **Node.js**, **Express**, and **MongoDB**.

## Features Implemented
- Google OAuth login with JWT-based authentication.
- API endpoints for:
  - Creating, retrieving, updating, and deleting posts.
  - Adding and listing comments on posts.
  - Managing favorite posts.
- CORS configured to support both local development and deployed frontend.
- Cookie-based authentication with cross-subdomain support.
- MongoDB connection using Mongoose.
- Health check endpoint for deployment status.