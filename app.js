const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const editorRoutes = require('./routes/editor');
const endUserRoutes = require('./routes/endUser');
const installRoutes = require('./routes/installer');

app.use(installRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use('/editor', editorRoutes);
app.use(endUserRoutes);
