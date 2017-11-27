// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    db.User.findAll({
      include:[db.Post]
    })
    .then(function(dbUser) {
    res.json("/members");
  }).catch(function(err) {
  // print the error details
  console.log(err, req.body);
});
  });

  app.get("/api/posts/category/:category", function(req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    }).catch(function(err) {
    // print the error details
    console.log(err, req.body);
});
  });

  // Get rotue for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    db.Post.findOne({
      where: {
        email: req.params.email
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    }).catch(function(err) {
    // print the error details
    console.log(err, req.body);
});
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    console.log(req.body);
    db.Post.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      email: req.body.email,
      id: req.body.id
    })
    .then(function(dbPost) {
      console.log('success');
      res.json(dbPost);
    }).catch(function(err) {
    // print the error details
    console.log(err, req.body);
});
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        email: req.params.email
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    }).catch(function(err) {
    // print the error details
    console.log(err, req.body);
});
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(req.body,
      {
        where: {
          email: req.body.email
        }
      })
    .then(function(dbPost) {
      res.json(dbPost);
    }).catch(function(err) {
    // print the error details
    console.log(err, req.body);
});
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");

    // req.logout();
    // req.session.destroy(cb);
    // function cb() {
    //    res.redirect('/');
    // }
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

};
