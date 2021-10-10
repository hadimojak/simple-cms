const express = require('express');
const app = express();
const path = require('path');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const editorRoutes = require('./routes/editor');
const endUserRoutes = require('./routes/endUser');
const installRoutes = require('./routes/installer');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, 'public')));

// app.use(installRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);
// app.use('/editor', editorRoutes);
// app.use(endUserRoutes);

app.listen(3000, () => {
    console.log('Listening on port: ', 3000);
}).on('error', (e) => {
    console.log('Error happened: ', e.message);
});

