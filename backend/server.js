const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const app = express();
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "D:/USER DATA/Downloads/Quick/New/frontend/public"
    ); // Specify the destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // Rename the file with a unique name
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only certain file types (e.g., images)
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
});

let storeOtp;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "newslettersonly111@gmail.com", // Your Gmail email address
    pass: "wppmcyppwqwhwnin", // Your Gmail password
  },
});

app.post("/send-otp", (req, res) => {
  const otp = generateOTP();
  const email = req.body.email;
  storeOtp = otp;
  // Store OTP in the memory

  // Send OTP to the user's email
  const mailOptions = {
    from: "newslettersonly111@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      return res.json({ message: "OTP sent successfully" });
    }
  });
});

//message routes
app.get("/getmessage/:userid", (req, res) => {
  const id = req.params.userid;

  // Use placeholders for receiver_id and sender_id
  const sql = "SELECT sender.username AS sender_name, receiver.username AS receiver_name,sender.userid as id, messaging.message_content, messaging.sender_id, messaging.receiver_id FROM messaging INNER JOIN users AS sender ON messaging.sender_id = sender.userid INNER JOIN users AS receiver ON messaging.receiver_id = receiver.userid WHERE receiver_id = ? OR sender_id = ? Order By time_stamp";

  // Create an array of values to replace the placeholders
  const values = [id, id];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch data" });
    } else {
      // Return the data
      res.json(data);
    }
  });
});
app.get("/getdetails/:userid", (req, res) => {
  const id = req.params.userid;
  console.log(id)
  // Use placeholders for receiver_id and sender_id
  const sql = "SELECT username FROM users WHERE `userid` = ?";

  // Create an array of values to replace the placeholders
  const values = [id];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch data" });
    } else {
      // Return the data
      res.json(data);
    }
  });
});

app.get('/chat/:userid', (req, res) => {
  const id = req.params.userid;
  const sql = "SELECT DISTINCT users.userid, users.username FROM users WHERE users.userid IN (SELECT DISTINCT sender_id FROM messaging WHERE receiver_id = ?) AND users.userid IN (SELECT DISTINCT receiver_id FROM messaging WHERE sender_id = ?)"
  const values = [id, id]
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error validating data:', err);
      return res.json("error");
    }
    else {
      res.json(result);
    }
  });
});

app.get('/page/:prodid', (req, res) => {
  const id = parseInt(req.params.prodid);
  const sql = "SELECT products.*, users.username FROM products INNER JOIN users ON products.seller_id = users.userid WHERE products.product_id = ?";

  db.query(sql, id, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error' });
    }
    else {
      res.json(data);
    }
  })
});



app.post('/bought/:sellid', (req, res) => {
  const id = req.params.sellid;
  console.log(id);
  const sql = "UPDATE products SET `truefalse` = ? WHERE `product_id` = ?";
  const num = 1;
  const values = [num, id];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    } else {
      // Product updated successfully
      res.status(200).json({ message: 'Product updated successfully' });
    }
  });
});


app.post('/handleSubmit', (req, res) => {
  const { content, sender, receiver } = req.body;

  const sql = "Insert INTO messaging (`message_content`,`sender_id`,`receiver_id`) VALUES (?,?,?)";
  const values = [
    content,
    sender,
    receiver
  ]
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to create account' });
    } else {
      return res.json({ message: 'Account created successfully' });
    }
  });

});





app.post("/verify-otp", (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const storeOtpString = String(storeOtp);
  console.log("stored otp: " + storeOtp);
  console.log("input otp: " + otp);

  if (storeOtpString === otp) {
    // Correct OTP, send success response
    console.log("OTP verified successfully");
    return res.json({ message: "OTP verified successfully" });
  } else {
    // Incorrect OTP, send error response
    console.log("Invalid OTP");
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

app.post("/verify-otp2", (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const storeOtpString = String(storeOtp);
  console.log("stored otp: " + storeOtp);
  console.log("input otp: " + otp);

  if (storeOtpString === otp) {
    // Correct OTP, send success response
    console.log("OTP verified successfully");
    return res.json({ message: "OTP verified successfully" });
  } else {
    // Incorrect OTP, send error response
    console.log("Invalid OTP");
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quicktrade",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newP = password;
  const sql = "SELECT * FROM users WHERE `email` = ?";

  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error("Error validating data:", err);
      return res.json("error");
    }

    if (data.length > 0) {
      const storedHashedPassword = data[0].password; // Get the hashed password from the database
      console.log(storedHashedPassword);
      bcrypt.compare(newP, storedHashedPassword, (compareErr, isMatch) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          return res.json({ status: "error" });
        }

        if (isMatch) {
          // Passwords match, login successful
          const user = {
            id: data[0].userid,
            email: data[0].email,
            username: data[0].username,
            profile_pic: data[0].profile_pic,
            admin: data[0].admin,
            number: data[0].contact_info,
          };
          return res.status(200).send(user);
        } else {
          // Passwords don't match
          return res.status(400).send({ success: false });
        }
      });
    } else {
      // No user found with the given email
      return res.status(401).send({ success: false });
    }
  });
});

app.post("/check-email", (req, res) => {
  const email = req.body.email;

  // Query the database to check if the email already exists
  const sql = "SELECT * FROM users WHERE `email` = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Failed to check email" });
    } else {
      if (results.length > 0) {
        // Email exists, send success response
        res.status(200).json({ exists: true });
      } else {
        // Email doesn't exist, send success response
        res.status(200).json({ exists: false });
      }
    }
  });
});

app.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO users (`username`, `email`, `password`,`profile_pic`) VALUES (?, ?, ?, ?)";
  const { name, email, password } = req.body;

  // Hash the password before inserting it into the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Failed to create account" });
    }

    const values = [
      name,
      email,
      hashedPassword,
      (profile_pic = "./frontend/public/logo192.png"), // Use the hashed password
    ];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Failed to create account" });
      } else {
        return res.json({ message: "Account created successfully" });
      }
    });
  });
});

app.post("/forgot", (req, res) => {
  const { email, newPassword } = req.body;

  // Hash the new password
  bcrypt.hash(newPassword, 10, (hashError, hashedPassword) => {
    if (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).json({ error: "Failed to update password" });
    }

    // Update the password in the database
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";

    db.query(
      updatePasswordQuery,
      [hashedPassword, email],
      (updatePasswordError, updateResults) => {
        if (updatePasswordError) {
          console.error("Error updating password:", updatePasswordError);
          return res.status(500).json({ error: "Failed to update password" });
        }

        // Password updated successfully
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      }
    );
  });
});

app.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    const image = req.file.filename;
    const phone = req.body.phoneNumber;
    const email = req.body.email;
    const profilequery =
      "UPDATE users SET profile_pic= ?,contact_info= ? where email = ?";
    db.query(profilequery, [image, phone, email], (err, updatedResults) => {
      if (err) {
        console.error("Error updating profile picture:", err);
        return res
          .status(500)
          .json({ error: "Failed to update profile picture" });
      }

      res.status(200).json({
        message: "profile pic uploaded successulffy",
      });
    });
  }
);

app.get("/allproducts", async (req, res) => {
  const getQuery = "SELECT * FROM products ORDER BY product_id";

  db.query(getQuery, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Products not found" });
    } else {
      const products = data.map((productData) => ({
        id: productData.product_id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        posting_date: productData.posting_date,
        location: productData.location,
        seller_id: productData.seller_id,
        image1: productData.image1,
        image2: productData.image2,
        sold: productData.truefalse
      }));
      res.status(200).json(products);
    }
  });
});

app.get("/allusers", async (req, res) => {
  const getQuery = "SELECT * FROM users";

  db.query(getQuery, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "users not found" });
    } else {
      const users = data.map((userData) => ({
        id: userData.userid,
        username: userData.username,
        contact_info: userData.contact_info,
        email: userData.email,
        admin: userData.admin,
        profile_pic: userData.profile_pic,
      }));
      res.status(200).json(users);
    }
  });
});

app.post("/addpdt", upload.array("images", 2), (req, res) => {
  const { title, price, description, category, location, seller_id, latitude, longitude } = req.body;
  const files = req.files;
  const imageNames = files.map((file) => file.filename);
  const query =
    "INSERT INTO products (title, description, price,category,location,image1,image2,seller_id,lat,lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
  const values = [
    title,
    description,
    price,
    category,
    location,
    imageNames[0],
    imageNames[1],
    seller_id,
    latitude,
    longitude
  ];
  console.log(values.latitude);

  db.query(query, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Not able to add" });
    }
    res.status(200).json({ message: "Product added successfully" });
  });

});

app.delete("/delete-product/:productId", (req, res) => {
  const id = req.params.productId;
  const query = "DELETE FROM products where product_id = ?";

  db.query(query, id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "failed to delete product" });
    } else {
      res.status(200).json({ message: "successfully deleted the product" });
    }
  });
});

app.delete("/delete-products/:productId", (req, res) => {
  const id = req.params.productId;
  const query = "DELETE FROM products where product_id = ?";

  db.query(query, id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "failed to delete product" });
    } else {
      res.status(200).json({ message: "successfully deleted the product" });
    }
  });
});

app.delete("/delete-user/:userId", (req, res) => {
  const id = req.params.userId;
  const query = "DELETE FROM users where userid = ?";

  db.query(query, id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "failed to delete user" });
    } else {
      res.status(200).json({ message: "successfully deleted the user" });
    }
  });
});

app.post("/handleSubmit", (req, res) => {
  const { content, sender, receiver } = req.body;
  console.log(content);
  const sql =
    "Insert INTO messaging (`message_content`,`sender_id`,`receiver_id`) VALUES (?,?,?)";
  const values = [content, sender, receiver];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to create account" });
    } else {
      return res.json({ message: "Account created successfully" });
    }
  });
});

//each prod page route
app.get("/page/:prodid", (req, res) => {
  const id = parseInt(req.params.prodid);
  const sql = "Select * From products Where `product_id` = ?";

  db.query(sql, id, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error" });
    } else {
      res.json(data);
    }
  });
});

//favorite routes
app.get("/favorites/:userid", (req, res) => {
  const id = parseInt(req.params.userid);
  const sql = "Select * From favorites Where `userid` = ?";

  db.query(sql, id, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error" });
    } else {
      res.json(data);
    }
  });
});

app.post("/addfav", (req, res) => {
  const { userId, productId } = req.body;
  const sql = "INSERT INTO favorites (`userid`, `product_id`) VALUES (?, ?)";

  db.query(sql, [userId, productId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error" });
    } else {
      res.status(200);
    }
  });
});

app.delete("/delfav/:userId/:productId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);
  const sql = "DELETE FROM favorites WHERE userid = ? AND product_id = ?";

  db.query(sql, [userId, productId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error" });
    } else {
      res.status(200);
    }
  });
});
//fetch listed items
app.get("/listed/:userid", (req, res) => {
  const id = parseInt(req.params.userid);
  const sql = "SELECT * FROM products WHERE seller_id = ?";

  db.query(sql, id, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error" });
    } else {
      res.json(data);
    }
  });
});

//update details
app.post("/update-data", upload.single("profile_pic"), async (req, res) => {
  const phone = req.body.number;
  const name = req.body.username;
  const email = req.body.email;
  const id = req.body.id;

  // Check if a file was uploaded
  if (req.file) {
    // A file was uploaded, update profile picture
    const image = req.file.filename;

    const profilequery =
      "UPDATE users SET profile_pic = ?, contact_info = ?, username = ? WHERE userid = ?";
    db.query(profilequery, [image, phone, name, id], (err, updatedResults) => {
      if (err) {
        console.error("Error updating profile picture:", err);
        return res
          .status(500)
          .json({ error: "Failed to update profile picture" });
      }
      console.log("Updated profile pic", image, email);
      res.status(200).json({
        message: "Profile pic uploaded successfully",
      });
    });
  } else {
    // No file was uploaded, update other fields
    const profilequery =
      "UPDATE users SET contact_info = ?, username = ? WHERE userid = ?";
    db.query(profilequery, [phone, name, id], (err, updatedResults) => {
      if (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({ error: "Failed to update user profile" });
      }
      console.log("Updated user profile without changing profile pic", email);
      res.status(200).json({
        message: "User profile updated successfully",
      });
    });
  }
});

//route for user purchases
app.get("/user-purchases/:userId", (req, res) => {
  const id = parseInt(req.params.userId);

  // Execute the SQL query
  const sql = `
      SELECT
          up.purchase_date as date,
          p.product_id ,
          p.description,
          p.title as title,
          p.price as price,
          p.image1 as image1,
          p.image2 as image2,
          p.seller_id as seller_id,
          u.username AS seller_name
      FROM user_purchases AS up
      JOIN products AS p ON up.product_id = p.product_id
      JOIN users AS u ON p.seller_id = u.userid
      WHERE up.userid = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

//comment route
app.post("/add-comment", async (req, res) => {
  const { c_t, s_id, id, rating } = req.body;

  // Create a new review with the current date
  const review = {
    userid: id,
    seller_id: s_id,
    rating,
    review_content: c_t,
    review_date: new Date(),
  };

  // Define the SQL query
  const query =
    "INSERT INTO seller_reviews (userid, seller_id, rating, review_content, review_date) VALUES (?, ?, ?, ?, ?)";
  const values = [
    review.userid,
    review.seller_id,
    review.rating,
    review.review_content,
    review.review_date,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error adding review:", error);
      res.status(500).send("Failed to add the review");
    } else {
      res.status(200).send("Review added successfully");
    }
  });
});

//route for user reviews
app.get("/user-reviews/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
          SELECT sr.review_id as id, sr.rating as rating, sr.review_content as content, sr.review_date as date, u.username as name, u.profile_pic AS pic
          FROM seller_reviews AS sr
          JOIN users AS u ON sr.seller_id = u.userid
          WHERE sr.userid = ?
        `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "Failed to fetch user reviews" });
    } else {
      res.status(200).json(results);
    }
  });
});

//delete user-review
app.delete("/delete-review/:review_id", (req, res) => {
  const reviewId = req.params.review_id;

  const deleteReviewQuery = "DELETE FROM seller_reviews WHERE review_id = ?";

  db.query(deleteReviewQuery, [reviewId], (err, result) => {
    if (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ error: "Failed to delete the review" });
    } else {
      res.status(200).json({ message: "Review deleted successfully" });
    }
  });
});


app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
