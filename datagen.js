const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const faker = require("faker");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

// Connect to your MongoDB database (replace with your MongoDB connection string)
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/writeit",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = require("./models/User"); // Import your User model
const BlogPost = require("./models/BlogPost"); // Import your BlogPost model
const Comment = require("./models/Comment"); // Import your Comment model

async function generateRandomData() {
  try {
    // Delete existing data (optional)
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await Comment.deleteMany({});

    // Generate 5 random users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "password123", // Set a default password
      });

      // Hash the user's password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // Save the user
      users.push(await user.save());
    }

    // Generate 20 random blog posts with the authors being one of the users
    const blogPosts = [];
    for (let i = 0; i < 20; i++) {
      const author = users[Math.floor(Math.random() * users.length)];
      const loremIpsum = new LoremIpsum({
        sentencesPerParagraph: {
          max: 8,
          min: 4,
        },
        wordsPerSentence: {
          max: 16,
          min: 4,
        },
      });
      const blogPost = new BlogPost({
        title: faker.lorem.words(5),
        content: loremIpsum.generateParagraphs(7),
        author: author.username,
        categories: [faker.lorem.word(), faker.lorem.word()],
      });

      // Save the blog post
      blogPosts.push(await blogPost.save());
    }

    // Generate 3 to 7 random comments for each blog post with commenter names being one of the users
    for (const blogPost of blogPosts) {
      const numComments = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numComments; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)];

        const comment = new Comment({
          commenterName: commenter.username,
          commentText: faker.lorem.sentence(),
          blogPostId: blogPost._id,
        });

        // Save the comment
        await comment.save();
      }
    }

    console.log("Random data generated successfully.");
  } catch (error) {
    console.error("Error generating random data:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

generateRandomData();
