require("newrelic");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const fs = require("fs");
const initializePassport = require("./passport-config.js");
const path = require("path");
const methodOverride = require("method-override");
const { Paynow } = require("paynow");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const d = new Date();
const daYear = d.getFullYear();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(
  session({
    secret: "spoon@1989",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Nerbular Server running on port ${PORT}`));

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://cardyy:spoon1989@schools-snqvi.mongodb.net/vault?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection
  .once("open", function () {
    console.log("You are now connected to the Nebular database");
  })
  .on("error", function (error) {
    console.log("connection error", error);
  });

const appSchema = new mongoose.Schema([
  {
    name: String,
    __v: Number,
    classesName: [String],
    streams: [],
    city: String,
    upcomingSchoolEvents: [
      { _id: String, name: String, date: String, time: String, key: String },
    ],
    news: [
      {
        _id: String,
        headlines: String,
        main: String,
        date: String,
        key: String,
      },
    ],
    fees: [{ _id: String, type1: String, amount: Number }],
    checkList: [
      {
        _id: String,
        stream: String,
        stationery: [String],
        uniforms: [String],
        books: [String],
        miscellenious: [String],
      },
    ],
    address: String,
    image: String,
    currentYear: Number,
    contact: String,
    email: String,
    password: String,
    timeShedule: [String],
    subjects: [String],
    classes: {
      Monday: [[String, String, String]],
      Tuesday: [[String, String, String]],
      Wednesday: [[String, String, String]],
      Thursday: [[String, String, String]],
      Friday: [[String, String, String]],
    },
    principal: String,
    principalContact: String,
    houses: [String],
    sports: [String],
    clubs: [String],
    teachers: [
      {
        _id: String,
        name: String,
        email: String,
        password: String,
        contact: String,
        session: Number,
        address: String,
        image: String,
        subjectsTaken: [],
        extraCurricular: {
          Sports: [String],
          Clubs: [String],
        },
        duties: [{ duty: String, date: String, time: String }],
      },
    ],
    students: [
      {
        _id: String,
        city: String,
        address: String,
        firstName: String,
        surname: String,
        propic: String,
        newStudent: String,
        idNumber: String,
        house: String,
        email: String,
        password: String,
        leftSchool: Boolean,
        gender: String,
        contacts: String,
        age: String,
        stream: String,
        symbol: String,
        newClass: Number,
        className: String,
        payments: [
          {
            _id: String,
            date: String,
            form: String,
            amount: Number,
            contact: Number,
            paidBy: String,
            actualfee: Number,
          },
        ],
        subjectsLearnt: [
          {
            _id: String,
            subject: String,
            courseWork: [
              {
                _id: String,
                term: Number,
                year: String,
                date: String,
                Topic: String,
                Mark: Number,
              },
            ],
            homeWork: [
              {
                _id: String,
                term: Number,
                year: String,
                date: String,
                Topic: String,
                Mark: Number,
              },
            ],
            inClassTest: [
              {
                _id: String,
                term: Number,
                year: String,
                date: String,
                Topic: String,
                Mark: Number,
              },
            ],
            finalTest: [
              {
                _id: String,
                term: Number,
                year: String,
                date: String,
                Mark: Number,
              },
            ],
            attendance: [
              {
                _id: String,
                attended: String,
                date: String,
              },
            ],
          },
        ],
        sports: [String],
        clubs: [String],
        booksBorrowed: [
          {
            book: String,
            author: String,
            date: String,
          },
        ],
        endOfTermResults: {},
        previousSchools: [String],
        parentName: [String],
        parentOccupation: { mother: String, father: String },
        dateOfBirth: String,
        paidAmount: Number,
      },
    ],
  },
]);
const appSchema2 = new mongoose.Schema([
  {
    name: String,
    contact: Number,
    city: String,
    ecocashnumber: Number,
    rating: Number,
    schools: [String],
    stationery: [
      {
        name: String,
        outletName:String,
        outletId:String,
        price: Number,
        image: String,
        dreails: String,
        quantity: Number,
        key: Number,
      },
    ],
    uniforms: [
      {
        name: String,
        outletName:String,
        outletId:String,
        price: Number,
        image: String,
        dreails: String,
        quantity: Number,
        key: Number,
      },
    ],
    books: [
      {
        name: String,
        outletName:String,
        outletId:String,
        price: Number,
        image: String,
        dreails: String,
        quantity: Number,
        key: Number,
      },
    ],
    miscellaneous: [
      {
        name: String,
        outletName:String,
        outletId:String,
        price: Number,
        image: String,
        dreails: String,
        quantity: Number,
        key: Number,
      },
    ],
    purchases: [
      {
        _id: String,
        school: String,
        name: String,
        date: String,
        contact: String,
        address: String,
        idNumber: String,
        className: String,
        itemName: [],
        totalAmount:Number,
        delivered: String,
      },
    ],
  },
]);
const records = mongoose.model("schools", appSchema);
const outlets = mongoose.model("outlets", appSchema2);

app.post("/users", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  records.find({}, function (err, data) {
    if (err) throw err;
    for (var i in data) {
      var usernameIsPresent = data[i].students.some(function (el) {
        return el.email === username && el.password === password;
      });
      if (usernameIsPresent === true) {
        break;
      }
    }

    if (usernameIsPresent === true) {
      result = data.filter((a) =>
        a.students.some((u) => u.email == username && u.password == password)
      );

      const schoolId = result[0]._id;
      const stream = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].stream;
      const city = result[0].city;
      const school = result[0].name;
      const name = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].firstName;
      const className = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].className;
      const address = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].address;
      const contact = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].contacts;
      const idNumber = result[0].students.filter(
        (s) => s.email == username && s.password == password
      )[0].idNumber;

      res.send({
        success: true,
        user: username,
        zita: schoolId,
        stream: stream,
        events: "Upcoming School Events",
        news: "News & Announcements",
        city: city,
        school: school,
        firstName: name,
        contact: contact,
        address: address,
        idNumber: idNumber,
        className: className,
      });
    } else {
      res.send({ success: false, message: "No such user in our database!" });
    }
  });
});

app.post("/teachers", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  records.find({}, function (err, data) {
    if (err) throw err;
    for (var i in data) {
      var usernameIsPresent = data[i].teachers.some(function (el) {
        return el.email === username && el.password === password;
      });

      if (usernameIsPresent === true) {
        break;
      }
    }

    if (usernameIsPresent === true) {
      var result = data.filter((a) =>
        a.teachers.some((u) => u.email == username && u.password == password)
      );
      var redID = result[0]._id;

      res.render("records", {
        data: result
          .filter((a) => a.teachers.some((u) => u.email == username))[0]
          .teachers.find(({ email }) => email === username),
        id: result.filter((a) => a.teachers.some((u) => u.email == username))[0]
          ._id,
        students: result.filter((a) =>
          a.teachers.some((u) => u.email == username)
        )[0].students,
        email: result
          .filter((a) => a.teachers.some((u) => u.email == username))[0]
          .teachers.find(({ email }) => email === username).contact,
        popup: "",
      });
      setTimeout(async function () {
        let attendanceArray;
        attendanceArray = await records.findById(redID);
        attendanceArray.teachers.find(
          ({ email }) => email === username
        ).session = attendanceArray.teachers.find(
          ({ email }) => email === username
        ).session = 1;
        try {
          await attendanceArray.save(function (err, data) {
            if (err) throw err;
          });
          console.log("Session logged");
        } catch {
          console.log("Could not log user");
        }
      }, 1);
    } else {
      res.render("teachers", { errormessage: "your message" });
    }
  });
});

app.get("/users", function (req, res) {
  records.find({}, function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

app.get("/outlets", function (req, res) {
  outlets.find({}, function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

app.post("/store", function (req, res) {
  var d = req.body.outId;
  
  let paynow = new Paynow("9130", "79e60b36-e2ee-48da-b2f4-a09ed08049d9");
  let payment = paynow.createPayment("Invoice 37", "cardyy@gmail.com");
  const item = req.body.item;
  const amount = req.body.amount;
  let phoneNumber = req.body.phoneNumber;
  payment.add(item, amount);
  paynow
    .sendMobile(payment, phoneNumber, "ecocash")
    .then(function (response) {
      if (response.success) {
        let instructions = response.instructions;
        let pollUrl = response.pollUrl;
        console.log(instructions);

        //save
        
        setTimeout(async function () {
        	console.log(d[i])
          let outletsArray;
          for (var i in d){
          outletsArray = await outlets.findById(d[i]);
          outletsArray[i].purchases = outletsArray[i].purchases.concat({
            school: req.body.school,
            name: req.body.name,
            date: "02",
            contact: req.body.contact,
            address: req.body.address,
            idNumber: req.body.idNumber,
            className: req.body.className,
            itemName: req.body.itemName,
            totalAmount: req.body.amount,
            delivered: "No",
          });}
          try {
            await outletsArray.save(function (err, data) {
              if (err) throw err;
            });
            console.log("done");
          } catch {
            if (outletsArray == null) {
              console.log("not done");
            }
          }
        }, 1);
      } else {
      	
        setTimeout(async function () {
        	
          let outletsArray;
          outletsArray = await outlets.findById(d[i]);
          outletsArray[i].purchases = outletsArray[i].purchases.concat({
            school: req.body.school,
            name: req.body.name,
            date: "02",
            contact: req.body.contact,
            address: req.body.address,
            idNumber: req.body.idNumber,
            className: req.body.className,
            itemName: req.body.itemName,
            totalAmount: req.body.amount,
            delivered: "No",
          });
          try {
            await outletsArray.save(function (err, data) {
              if (err) throw err;
            });
            console.log("its done");
          } catch {
            if (outletsArray == null) {
              console.log("not done");
            }
          }
        }, 1);
				
        console.log(response.error);
      }
    })
    .catch((ex) => {
      console.log("Your application has broken an axle", ex);
    });
});

app.get("/allStudents/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("allStudents.ejs", { data: data, school: req.params.id });
  });
});

app.get("/profile/:id/:profile", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;

    res.render("profile", {
      data: data,
      profile: req.params.profile,
      school: req.params.id,
      d2: data[0].students.find(
        ({ idNumber }) => idNumber === req.params.profile
      ),
    });
  });
});

app.get("/allTeachers/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("allTeachers.ejs", { data: data, school: req.params.id });
  });
});

app.get("/classes/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("classes.ejs", {
      data: data,
      students: data[0].students,
      school: req.params.id,
    });
  });
});

app.get("/textSmS/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("textSmS.ejs", {
      data: data[0],
      school: req.params.id,
      popup: "",
    });
  });
});

app.get("/addStudent/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("addStudent.ejs", {
      data: data[0],
      school: req.params.id,
      popup: "",
    });
  });
});

app.get("/addTeachers/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("addTeachers.ejs", {
      data: data[0],
      school: req.params.id,
      popup: "",
    });
  });
});

app.get("/addFees/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("addFees.ejs", {
      data: data[0],
      school: req.params.id,
      popup: "",
    });
  });
});

app.get("/feesCollection/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("feesCollection.ejs", { data: data, school: req.params.id });
  });
});

app.get("/events/:id", checkAuthenticated, function (req, res) {
  records.find({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.render("events", { data: data[0], school: req.params.id, popup: "" });
  });
});

app.get("/home", checkAuthenticated, function (req, res) {
  records.find({ _id: req.user.id }, function (err, data) {
    if (err) throw err;
    var wd = data[0].students;
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    var newdate = year + "-" + month + "-" + day;
    var attCount = 0;
    for (i = 0; i < wd.length; i++) {
      var sbjL = wd[i].subjectsLearnt
        .map((item) => {
          return item.attendance;
        })
        .reduce(function (a, b) {
          return a.concat(b);
        })
        .filter(function (obj) {
          return obj.attended === "true" && obj.date == newdate;
        });
      if (
        sbjL.some((q) => {
          return q.date == newdate;
        })
      ) {
        attCount += 1;
      }
    }
    res.render("home", {
      data: data,
      id: req.user.id,
      daily: attCount,
      currentYear: daYear,
    });
  });
});

app.get("/sms", function (req, res) {
  records.find({}, function (err, data) {
    if (err) throw err;
    res.render("smsGateway");
  });
});

app.get("/", checkNotAuthenticated, function (req, res) {
  records.find({}, function (err, data) {
    if (err) throw err;
    res.render("index", { data: data });

    initializePassport(
      passport,
      (email) => data.find((user) => user.email === email),
      (id) => data.find((user) => user.id === id)
    );
  });
});

app.get("/teachers", function (req, res) {
  records.find({}, function (err, data) {
    if (err) throw err;
    res.render("teachers", { data: data, errormessage: "" });
  });
});

app.post("/textSmS/:id", async (req, res) => {
  let newsArray;
  var d = new Date();
  var dat = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  newsArray = await records.findById(req.params.id);
  newsArray.news = newsArray.news.concat({
    headlines: req.body.headline,
    main: req.body.news,
    date: dat,
    key: Date.now(),
  });
  try {
    await newsArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render(`textSmS`, {
      data: newsArray,
      school: req.params.id,
      popup: "done",
    });
  } catch {
    if (newsArray == null) {
      res.redirect("/index");
    }
  }
});

app.post("/events/:id", async (req, res) => {
  let upcomingSchoolEventsArray;

  upcomingSchoolEventsArray = await records.findById(req.params.id);
  upcomingSchoolEventsArray.upcomingSchoolEvents = upcomingSchoolEventsArray.upcomingSchoolEvents.concat(
    {
      name: req.body.parents[0],
      date: req.body.parents[1],
      time: req.body.parents[2],
      key: Date.now(),
    }
  );
  try {
    await upcomingSchoolEventsArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render(`events`, {
      data: upcomingSchoolEventsArray,
      school: req.params.id,
      popup: "done",
    });
  } catch {
    if (upcomingSchoolEventsArray == null) {
      res.redirect("/index");
    }
  }
});

app.post("/addFees/:id", async (req, res) => {
  let upcomingSchoolEventsArray;

  upcomingSchoolEventsArray = await records.findById(req.params.id);
  var feesAmount = await records.findById(req.params.id);
  var fixx = feesAmount.fees;
  var fx1 = fixx.filter((type) => {
    return type.type1 === req.body.fees;
  });
  var amnt = fx1[0].amount;

  upcomingSchoolEventsArray.students.find(
    ({ idNumber }) => idNumber === req.body.id
  ).payments = upcomingSchoolEventsArray.students
    .find(({ idNumber }) => idNumber === req.body.id)
    .payments.concat({
      date: req.body.date,
      form: req.body.fees,
      amount: req.body.amount,
      contact: req.body.contact,
      paidBy: req.body.paidBy,
      actualfee: amnt,
    });
  try {
    await upcomingSchoolEventsArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render(`addFees`, {
      data: upcomingSchoolEventsArray,
      school: req.params.id,
      popup: "done",
    });
  } catch {
    if (upcomingSchoolEventsArray == null) {
      res.redirect("/index");
    }
  }
});

//Attendance Post request
app.post("/records", async (req, res) => {
  let attendanceArray;
  var x = req.body.options;
  var classn = x.split(",")[0];
  var subjct = x.split(",")[1];
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;

  var username = cont.replace(/\s+/g, "");

  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students
    .filter((type) => {
      return type.className === classn;
    })
    .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct));
  for (var i in leng) {
    attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(
        ({ subject }) => subject === subjct
      ).attendance = attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(({ subject }) => subject === subjct)
      .attendance.concat({
        date: req.body.dateofbirth,
        attended: req.body.boolean[i],
      });
  }
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render("records", {
      data: attendanceArray.teachers.find(
        ({ contact }) => contact === username
      ),
      id: id,
      students: attendanceArray.students,
      email: username,
      popup: "done",
    });
  } catch {
    if (attendanceArray == null) {
      res.redirect("/index");
    }
  }
});

//Coursework Post request
app.post("/exercises", async (req, res) => {
  var d = new Date(req.body.dateofbirth);
  var yea = d.getFullYear();
  var x = req.body.options;
  var classn = x.split(",")[0];
  var subjct = x.split(",")[1];
  let attendanceArray;
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;
  var username = cont.replace(/\s+/g, "");
  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students
    .filter((type) => {
      return type.className === classn;
    })
    .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct));
  for (var i in leng) {
    attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(
        ({ subject }) => subject === subjct
      ).courseWork = attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(({ subject }) => subject === subjct)
      .courseWork.concat({
        date: req.body.dateofbirth,
        year: yea,
        term: req.body.term,
        Topic: req.body.topic,
        Mark: req.body.boolean[i],
      });
  }
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render("records", {
      data: attendanceArray.teachers.find(
        ({ contact }) => contact === username
      ),
      id: id,
      students: attendanceArray.students,
      email: username,
      popup: "done",
    });
  } catch {
    if (attendanceArray == null) {
      res.redirect("/index");
    }
  }
});

//Final Exams Post request

app.post("/finalExams", async (req, res) => {
  let attendanceArray;
  var d = new Date(req.body.dateofbirth);
  var yea = d.getFullYear();
  var x = req.body.options;
  var classn = x.split(",")[0];
  var subjct = x.split(",")[1];
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;
  var username = cont.replace(/\s+/g, "");
  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students
    .filter((type) => {
      return type.className === classn;
    })
    .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct));

  for (var i in leng) {
    attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(
        ({ subject }) => subject === subjct
      ).finalTest = attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(({ subject }) => subject === subjct)
      .finalTest.concat({
        date: req.body.dateofbirth,
        year: yea,
        term: req.body.term,
        Mark: req.body.boolean[i],
      });
  }
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render("records", {
      data: attendanceArray.teachers.find(
        ({ contact }) => contact === username
      ),
      id: id,
      students: attendanceArray.students,
      email: username,
      popup: "done",
    });
  } catch {
    if (attendanceArray == null) {
      res.redirect("/index");
    }
  }
});

//Homework Post request

app.post("/homeWork", async (req, res) => {
  let attendanceArray;
  var d = new Date(req.body.dateofbirth);
  var yea = d.getFullYear();
  var x = req.body.options;
  var classn = x.split(",")[0];
  var subjct = x.split(",")[1];
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;
  var username = cont.replace(/\s+/g, "");
  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students
    .filter((type) => {
      return type.className === classn;
    })
    .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct));

  for (var i in leng) {
    attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(
        ({ subject }) => subject === subjct
      ).homeWork = attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(({ subject }) => subject === subjct)
      .homeWork.concat({
        date: req.body.dateofbirth,
        year: yea,
        term: req.body.term,
        Topic: req.body.topic,
        Mark: req.body.boolean[i],
      });
  }
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render("records", {
      data: attendanceArray.teachers.find(
        ({ contact }) => contact === username
      ),
      id: id,
      students: attendanceArray.students,
      email: username,
      popup: "done",
    });
  } catch {
    if (attendanceArray == null) {
      res.redirect("/index");
    }
  }
});

//Inclass tests Post request

app.post("/tests", async (req, res) => {
  let attendanceArray;
  var d = new Date(req.body.dateofbirth);
  var yea = d.getFullYear();
  var x = req.body.options;
  var classn = x.split(",")[0];
  var subjct = x.split(",")[1];
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;
  var username = cont.replace(/\s+/g, "");
  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students
    .filter((type) => {
      return type.className === classn;
    })
    .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct));
  for (var i in leng) {
    attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(
        ({ subject }) => subject === subjct
      ).inClassTest = attendanceArray.students
      .filter((type) => {
        return type.className === classn;
      })
      .filter((a) => a.subjectsLearnt.some((u) => u.subject == subjct))
      [i].subjectsLearnt.find(({ subject }) => subject === subjct)
      .inClassTest.concat({
        date: req.body.dateofbirth,
        year: yea,
        term: req.body.term,
        Topic: req.body.topic,
        Mark: req.body.boolean[i],
      });
  }
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render("records", {
      data: attendanceArray.teachers.find(
        ({ contact }) => contact === username
      ),
      id: id,
      students: attendanceArray.students,
      email: username,
      popup: "done",
    });
  } catch {
    if (attendanceArray == null) {
      res.redirect("/index");
    }
  }
});

//Automated Put to all students

//Configurations for AWS image storage
const s3 = new aws.S3({
  secretAccessKey: "VGoMf0PAZzdHQ9eDQTwKWhwOeVaqld6Y6BkPLGi1",
  accessKeyId: "AKIAX36EJM5WKD6ZGHG3",
  Bucket: "nebularimages",
});
const storage = multerS3({
  s3: s3,
  bucket: "nebularimages",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
app.post("/classes/:id", async (req, res) => {
  studentsArray = await records.findById(req.params.id);
  var id = req.body.id;
  var newClass = req.body.newC;
  var symbol = newClass.slice(-1);
  var teachers = studentsArray.teachers;
  var nwe = "";
  var twe = "";
  var claNam = newClass;
  for (t = 0; t < teachers.length; t++) {
    for (var tt2 in teachers[t].subjectsTaken) {
      var allTeachers = teachers[t].subjectsTaken;
      if (allTeachers.hasOwnProperty(tt2)) {
        if (allTeachers[tt2][0] == claNam) {
          nwe += `${allTeachers[tt2][1]},`;
          twe += `${allTeachers[tt2][2]},`;
        }
      }
    }
  }
  var tar = nwe.length - 1;
  var rar = twe.length - 1;
  var ww = nwe.slice(0, tar);
  var xx = twe.slice(0, rar);
  var newww = ww.split(",");
  var newxx = xx.split(",");

  var subjL = "";
  for (aa = 0; aa < newww.length; aa++) {
    subjL += `{subject:"${newww[aa]}",courseWork:[{term:0,year:0,date:0,Topic:0,Mark:0}],homeWork:[{term:0,year:0,date:0,Topic:0,Mark:0}],inClassTest:[{term:0,year:0,date:0,Topic:0,Mark:0}],finalTest:[{term:0,year:0,date:0,Mark:0}],attendance:[{attended:0,date:0}]},`;
  }
  var aray = subjL;
  var nwy = aray.length - 1;
  var wch = aray.slice(0, nwy);
  var object = new Function("return [" + wch + "];")();

  studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].className = studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].className = newClass;

  studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].newClass = studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].newClass = 1;

  studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].symbol = studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].symbol = symbol;

  studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].subjectsLearnt = studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].subjectsLearnt = [];

  studentsArray.students.filter((type) => {
    return type.idNumber === id;
  })[0].subjectsLearnt = studentsArray.students
    .filter((type) => {
      return type.idNumber === id;
    })[0]
    .subjectsLearnt.concat(object);
  try {
    await studentsArray.save(function (err, data) {
      if (err) throw err;
    });
    res.redirect(`/classes/${req.params.id}`);
    console.log("done");
  } catch {
    if (studentsArray == null) {
      console.log("error");
      res.redirect("/index");
    }
  }
});

//Post request to add students in database
app.post("/addStudent/:id", upload, async (req, res) => {
  var dt = req.body.dt;
  var ffr = req.body.sid;
  var amn = req.body.amn;
  var knt = req.body.knt;
  var pyd = req.body.pyd;
  var af = req.body.af;

  if (dt.constructor == Array) {
    var one = req.body.dt;
  } else if (dt.constructor !== Array) {
    var one = [req.body.dt];
  }
  if (ffr.constructor == Array) {
    var two = req.body.sid;
  } else if (ffr.constructor !== Array) {
    var two = [req.body.sid];
  }
  if (amn.constructor == Array) {
    var three = req.body.amn;
  } else if (amn.constructor !== Array) {
    var three = [req.body.amn];
  }
  if (knt.constructor == Array) {
    var four = req.body.knt;
  } else if (knt.constructor !== Array) {
    var four = [req.body.knt];
  }
  if (pyd.constructor == Array) {
    var five = req.body.pyd;
  } else if (pyd.constructor !== Array) {
    var five = [req.body.pyd];
  }
  if (af.constructor == Array) {
    var six = req.body.af;
  } else if (af.constructor !== Array) {
    var six = [req.body.af];
  }

  var chk = "";
  for (a = 0; a < one.length; a++) {
    chk += `{date:"${one[a]}", form:"${two[a]}",amount:${three[a]}, contact:${four[a]}, paidBy:"${five[a]}", actualfee:${six[a]}  },`;
  }

  var aray = chk;
  var nwy = aray.length - 1;
  var wch = aray.slice(0, nwy);
  var objectStri = new Function("return [" + wch + "];")();

  let studentsArray;

  var mother = req.body.mom;
  var father = req.body.dad;
  if (mother.constructor == Array) {
    var mom = req.body.mom;
  } else if (mother.constructor !== Array) {
    var mom = [req.body.mom];
  }
  if (father.constructor == Array) {
    var dad = req.body.dad;
  } else if (father.constructor !== Array) {
    var dad = [req.body.dad];
  }
  var see = "";
  for (aa = 0; aa < mom.length; aa++) {
    see += `{mother:"${mom[aa]}",  father:"${dad[aa]}"},`;
  }
  var arra = see;
  var ne = arra.length - 1;
  var wat = arra.slice(0, ne);
  var occupation = new Function("return [" + wat + "];")();
  var real = occupation[0];
  const imageName = req.file.key;

  studentsArray = await records.findById(req.params.id);
  var teachers = studentsArray.teachers;
  var nwe = "";
  var twe = "";
  var claNam = req.body.streams + req.body.classesName;
  for (t = 0; t < teachers.length; t++) {
    for (var tt2 in teachers[t].subjectsTaken) {
      var allTeachers = teachers[t].subjectsTaken;
      if (allTeachers.hasOwnProperty(tt2)) {
        if (allTeachers[tt2][0] == claNam) {
          nwe += `${allTeachers[tt2][1]},`;
          twe += `${allTeachers[tt2][2]},`;
        }
      }
    }
  }
  var tar = nwe.length - 1;
  var rar = twe.length - 1;
  var ww = nwe.slice(0, tar);
  var xx = twe.slice(0, rar);
  var newww = ww.split(",");
  var newxx = xx.split(",");

  var subjL = "";
  for (aa = 0; aa < newww.length; aa++) {
    subjL += `{subject:"${newww[aa]}",courseWork:[{term:0,year:0,date:0,Topic:0,Mark:0}],homeWork:[{term:0,year:0,date:0,Topic:0,Mark:0}],inClassTest:[{term:0,year:0,date:0,Topic:0,Mark:0}],finalTest:[{term:0,year:0,date:0,Mark:0}],attendance:[{attended:0,date:0}]},`;
  }
  var aray = subjL;
  var nwy = aray.length - 1;
  var wch = aray.slice(0, nwy);
  var object = new Function("return [" + wch + "];")();

  studentsArray.students = studentsArray.students.concat({
    city: req.body.city,
    propic: imageName,
    address: req.body.address,
    firstName: req.body.name,
    surname: req.body.surname,
    idNumber: req.body.id,
    sports: req.body.sports,
    clubs: req.body.clubs,
    contacts: req.body.contacts,
    email: req.body.email,
    password: req.body.password,
    age: req.body.dob,
    parentName: req.body.parents,
    gender: req.body.gender,
    stream: req.body.streams,
    symbol: req.body.classesName,
    newClass: 0,
    className: claNam,
    house: req.body.house,
    newStudent: req.body.newstudent,
    previousSchools: req.body.pschool,
    parentOccupation: real,
    payments: objectStri,
    subjectsLearnt: object,
  });

  try {
    await studentsArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render(`addStudent`, {
      data: studentsArray,
      school: req.params.id,
      popup: "done",
    });
  } catch {
    if (studentsArray == null) {
      res.redirect("/index");
    }
  }
});

//Post request to upload student`s image to AWS
app.post("/addStudent/:id", async (req, res) => {
  upload(req, res, (error) => {
    console.log("requestOkokok", req.file);

    if (error) {
      console.log("errors", error);
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        res.json("Error: No File Selected");
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        res.send({
          location: imageLocation,
        });
      }
    }
  });
});

//Post request to add teachers to database
app.post("/addTeachers/:id", upload, async (req, res) => {
  var sp = "";
  var cl = "";
  var mon = "";
  var mtime = req.body.monTime;
  var msubjectTaken = req.body.monPeriod;
  var orts = req.body.sports;
  var bs = req.body.clubs;

  if (mtime.constructor == Array) {
    var mmtime = req.body.monTime;
  } else if (mtime.constructor !== Array) {
    var mmtime = [req.body.monTime];
  }
  if (msubjectTaken.constructor == Array) {
    var mmmsubjectTaken = req.body.monPeriod;
  } else if (msubjectTaken.constructor !== Array) {
    var mmmsubjectTaken = [req.body.monPeriod];
  }
  if (orts.constructor == Array) {
    var te = req.body.sports;
  } else if (orts.constructor !== Array) {
    var te = [req.body.sports];
  }
  if (bs.constructor == Array) {
    var at = req.body.clubs;
  } else if (bs.constructor !== Array) {
    var at = [req.body.clubs];
  }
  var nmme = req.body.tname + "" + req.body.tsurname;
  for (zz = 0; zz < mmtime.length; zz++) {
    mon += `["${mmtime[zz]}", "${mmmsubjectTaken[zz]}","${nmme}" ],`;
  }

  var e = mon;
  var na = e.length - 1;
  var w = e.slice(0, na);
  var onday = new Function("return [" + w + "];")();

  for (z = 0; z < te.length; z++) {
    sp += `["${te[z]}"],`;
    cl += `["${at[z]}"],`;
  }

  var n = sp.length - 1;
  var sprts = sp.slice(0, n);

  var nn = cl.length - 1;
  var clbs = cl.slice(0, nn);

  var date = req.body.date;
  var time = req.body.time;
  var duty = req.body.duty;

  if (date.constructor == Array) {
    var tesy = req.body.date;
  } else if (date.constructor !== Array) {
    var tesy = [req.body.date];
  }
  if (time.constructor == Array) {
    var ant = req.body.time;
  } else if (time.constructor !== Array) {
    var ant = [req.body.time];
  }
  if (duty.constructor == Array) {
    var an = req.body.duty;
  } else if (duty.constructor !== Array) {
    var an = [req.body.duty];
  }

  var check = "";
  for (a = 0; a < tesy.length; a++) {
    check += `{duty:"${tesy[a]}", time:"${ant[a]}",date:"${an[a]}" },`;
  }
  var array = check;
  var newy = array.length - 1;
  var watch = array.slice(0, newy);
  var ectStringArray = new Function("return [" + watch + "];")();
  const imageName = req.file.key;
  const emayl = `${req.body.tcontacts}@nebular.co.zw`;
  let teachersArray;
  teachersArray = await records.findById(req.params.id);
  teachersArray.teachers = teachersArray.teachers.concat({
    name: nmme,
    image: imageName,
    address: req.body.taddress,
    contact: req.body.tcontacts,
    session: 0,
    email: emayl,
    password: req.body.password,
    extraCurricular: { Sports: sprts, Clubs: clbs },
    duties: ectStringArray,
    subjectsTaken: onday,
  });
  try {
    await teachersArray.save(function (err, data) {
      if (err) throw err;
    });
    res.render(`addTeachers`, {
      data: teachersArray,
      school: req.params.id,
      popup: "done",
    });
  } catch {
    if (teachersArray == null) {
      res.redirect("/index");
    }
  }
});
app.post("/addTeachers/:id", async (req, res) => {
  upload(req, res, (error) => {
    console.log("requestOkokok", req.file);

    if (error) {
      console.log("errors", error);
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        res.json("Error: No File Selected");
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        res.send({
          location: imageLocation,
        });
      }
    }
  });
});

app.post("/sms", upload, async (req, res) => {
  var mon = "";
  var tue = "";
  var wed = "";
  var thu = "";
  var fri = "";

  var mtime = req.body.monTime;
  var msubjectTaken = req.body.monPeriod;
  var mclassname = req.body.monClass;
  var ctime = req.body.tueTime;
  var csubjectTaken = req.body.tuePeriod;
  var cclassname = req.body.tueClass;
  var wtime = req.body.wedTime;
  var wsubjectTaken = req.body.wedPeriod;
  var wclassname = req.body.wedClass;
  var ttime = req.body.thuTime;
  var tsubjectTaken = req.body.thuPeriod;
  var tclassname = req.body.thuClass;
  var ftime = req.body.friTime;
  var fsubjectTaken = req.body.friPeriod;
  var fclassname = req.body.friClass;

  for (z = 0; z < mtime.length; z++) {
    mon += `["${mtime[z]}", "${msubjectTaken[z]}","${mclassname[z]}"],`;
    tue += `["${ctime[z]}", "${csubjectTaken[z]}","${cclassname[z]}"],`;
    wed += `["${wtime[z]}", "${wsubjectTaken[z]}","${wclassname[z]}"],`;
    thu += `["${ttime[z]}", "${tsubjectTaken[z]}","${tclassname[z]}"],`;
    fri += `["${ftime[z]}", "${fsubjectTaken[z]}","${fclassname[z]}"],`;
  }

  var e = mon;
  var n = e.length - 1;
  var w = e.slice(0, n);
  var onday = new Function("return [" + w + "];")();

  var ee = tue;
  var nn = ee.length - 1;
  var ww = ee.slice(0, nn);
  var uesday = new Function("return [" + ww + "];")();

  var eee = wed;
  var nnn = eee.length - 1;
  var www = eee.slice(0, nnn);
  var ednesday = new Function("return [" + www + "];")();

  var eeee = thu;
  var nnnn = eeee.length - 1;
  var wwww = eeee.slice(0, nnnn);
  var hursday = new Function("return [" + wwww + "];")();

  var eeeee = fri;
  var nnnnn = eeeee.length - 1;
  var wwwww = eeeee.slice(0, nnnnn);
  var riday = new Function("return [" + wwwww + "];")();

  var testArray = req.body.school;
  var aamnt = req.body.amount;

  if (testArray.constructor == Array) {
    var tesy = req.body.school;
  } else if (testArray.constructor !== Array) {
    var tesy = [req.body.school];
  }

  if (aamnt.constructor == Array) {
    var ant = req.body.amount;
  } else if (aamnt.constructor !== Array) {
    var ant = [req.body.amount];
  }

  var check = "";
  for (a = 0; a < tesy.length; a++) {
    check += `{type1:"${tesy[a]}", amount:${ant[a]}},`;
  }
  var array = check;
  var newy = array.length - 1;
  var watch = array.slice(0, newy);
  var objectStringArray = new Function("return [" + watch + "];")();
  const imageName = req.file.key;

  //Checklist

  var dt = req.body.stream;
  if (dt.constructor == Array) {
    var newww = req.body.stream;
  } else if (dt.constructor !== Array) {
    var newww = [req.body.stream];
  }
  var decU = [];
  var decS = [];
  var decM = [];
  var decB = [];
  var subjL = "";
  for (var bb in newww) {
    decU.push(`U${bb}`);
    decS.push(`S${bb}`);
    decM.push(`M${bb}`);
    decB.push(`B${bb}`);
    subjL += `{stream:"${newww[bb]}",stationery:[${
      req.body[decS[bb]]
    }],uniforms:[${req.body[decU[bb]]}],books:[${
      req.body[decB[bb]]
    }],miscellenious:[${req.body[decM[bb]]}] },`;
  }
  var aray = subjL;
  var nwy = aray.length - 1;
  var wch = aray.slice(0, nwy);
  var object = new Function("return [" + wch + "];")();

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newrecords = records({
    name: req.body.name,
    image: imageName,
    city: req.body.city,
    classesName: req.body.test,
    streams: req.body.streams,
    fees: objectStringArray,
    checkList: object,
    currentYear: daYear,
    address: req.body.address,
    contact: req.body.contact,
    email: req.body.email,
    password: hashedPassword,
    timeShedule: req.body.timeschedule,
    subjects: req.body.subjects,
    classes: {
      Monday: onday,
      Tuesday: uesday,
      Wednesday: ednesday,
      Thursday: hursday,
      Friday: riday,
    },
    principal: req.body.principal,
    principalContact: req.body.principalContact,
    houses: req.body.houses,
    paymentStatus: req.body.status,
    sports: req.body.sports,
    clubs: req.body.clubs,
  });

  try {
    const newRecord =
      (await newrecords.save(function (err, data) {
        if (err) throw err;
      })) / res.redirect("/");
  } catch {
    res.redirect("/sms");
  }
});

app.post("/sms", async (req, res) => {
  upload(req, res, (error) => {
    console.log("requestOkokok", req.file);

    if (error) {
      console.log("errors", error);
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        res.json("Error: No File Selected");
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        res.send({
          location: imageLocation,
        });
      }
    }
  });
});

app.post(
  "/",
  urlencodedParser,
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post("/logout", async (req, res) => {
  let attendanceArray;
  var ob = req.body.id;
  var id = ob.replace(/\s+/g, "");
  var cont = req.body.userID;
  var username = cont.replace(/\s+/g, "");
  attendanceArray = await records.findById(id);
  attendanceArray.teachers.find(
    ({ contact }) => contact === username
  ).session = attendanceArray.teachers.find(
    ({ contact }) => contact === username
  ).session = 0;
  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.redirect("/teachers");
    console.log("Session logged out");
  } catch {
    console.log("not done");
  }
});

app.post("/update", async (req, res) => {
  let attendanceArray;
  var id = req.body.id;
  attendanceArray = await records.findById(id);
  var leng = attendanceArray.students;
  var newStream = 0;
  var newClass = 0;
  var nwe = "";
  var twe = "";
  for (i = 0; i < leng.length; i++) {
    var allClasses = attendanceArray.students[i].stream;
    var classesArray = attendanceArray.streams;
    var symbol = attendanceArray.students[i].symbol;
    var classN = attendanceArray.students[i].className;
    var teachers = attendanceArray.teachers;
    for (j = 0; j < classesArray.length; j++) {
      if (
        allClasses == classesArray[j] &&
        allClasses !== "Form4" &&
        allClasses !== "Form6" &&
        allClasses !== "Grade7"
      ) {
        newStream = classesArray[j + 1];
        newClass = classesArray[j + 1] + symbol;
      }
      if (
        allClasses == "Form4" ||
        allClasses == "Form6" ||
        allClasses == "Grade7"
      ) {
        newStream = "nill";
        newClass = "nill";
      }
    }
    attendanceArray.students[i].stream = attendanceArray.students[
      i
    ].stream.replace(allClasses, newStream);
    attendanceArray.students[i].className = attendanceArray.students[
      i
    ].className.replace(classN, newClass);
  }
  attendanceArray.currentYear = attendanceArray.currentYear = daYear;

  try {
    await attendanceArray.save(function (err, data) {
      if (err) throw err;
    });
    res.redirect("/home");
    console.log("done");
  } catch {
    console.log("hameno");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});