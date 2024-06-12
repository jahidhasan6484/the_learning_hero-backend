const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 8080;

// Databse connection
async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connection successful");

    app.listen(port, () => {
      console.log(`Mongoose listening on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect with database");
  }
}

main();
