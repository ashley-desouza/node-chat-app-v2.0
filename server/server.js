const path = require('path');
const express = require('express');

// Path to the public client assets
// Refer https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_join_paths
const publicPath = path.join(__dirname, '../public');

// Setup an Express App
let app = express();
const port = process.env.PORT || 3000;

// Use express middleware to define the location for static resources - 
// Refer http://expressjs.com/en/guide/using-middleware.html
app.use(express.static(publicPath));

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};
