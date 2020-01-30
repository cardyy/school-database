const express = require('express');
const app = express();
const bodyParser = require ('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:false})
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const fs = require('fs');
const initializePassport = require('./passport-config.js')
const path = require('path')
const methodOverride = require('method-override')

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash())
app.use(session({
secret:"spoon@1989",
resave:false,
saveUninitialized:false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
function checkAuthenticated(req,res,next ){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}

function checkNotAuthenticated(req,res,next ){
	if(req.isAuthenticated()){
		return res.redirect('/home')
	}
	next()
}

const PORT = process.env.PORT || 5000;	
app.listen(PORT, () => console.log(`Nerbular Server running on port ${PORT}`));


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cardyy:spoon1989@schools-snqvi.mongodb.net/vault?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.connection.once('open', function(){
    console.log('You are now connected to the Nebular database');

}).on('error', function(error){
    console.log('connection error', error)
})
const appSchema = new mongoose.Schema([{
  
 name:String,
 classesName:[String],
 streams:[],
 upcomingSchoolEvents:[{name:String , date:String, time:String}],
 fees:[{_id:String, type1:String, amount: Number}],
address:String,
image:String,
contact:String,
email:String,
password:String,
timeShedule:[String],
subjects:[String],
classes: {
Monday:[[String,String,String]],
Tuesday:[[String,String,String]],
Wednesday:[[String,String,String]],
Thursday:[[String,String,String]],
Friday:[[String,String,String]]
},
principal:String,
principalContact:String,
houses:[String],
paymentStatus:String,
sports:[String],
clubs:[String],
teachers:[{
name:String,
surname:String,
email:String,
password:String,
contact:String,
address:String,
image:String,
subjectsTaken:[],
extraCurricular:{
	Sports:[String], 
	Clubs:[String]},
duties:[{duty:String, date:String, time:String}],
}],
students:[{
    _id:String,
	city: String,
	address: String,
    firstName: String,
    surname: String,
    image:String,
    newStudent:String,
    idNumber: String,
    house: String,
    friends: [String],
    booksLost: [String],
    email: String,
    password: String,
    leftSchool: Boolean,
    gender: String,
    contacts: String,
    age: String,
    stream: String,
    className: String,
    payments: [{
    	_id:String,
        date: String ,
        form: String,
        amount: Number,
        contact:Number,
        paidBy:String,
        actualfee:Number
    }],
    subjectsLearnt: [{
            subject: String,
            courseWork:[{
            	term:Number,
                year:String,
            	date:String,
            	topic:String,
            	Mark:Number
            }],
            homeWork:[{
            	term:Number,
                year:String,
            	date:String,
            	topic:String,
            	Mark:Number
            }],
            inClassTest:[{
            	term:Number,
                year:String,
            	date:String,
            	topic:String,
            	Mark:Number
            }],
            finalTest:[{}],
            teacher: String,
            attendance:[{}]
}
	],
    sports: [String],
 clubs: [String],
     booksBorrowed: [{
        book: String,
        author: String,
        date: String
    }],
    endOfTermResults: {},
   position: [{}],
    previousSchools: [String],
    achievements: [String],
    teachersComments: [{
        science: String,
        history: String
    }],
  parentName:[String],
    parentOccupation:{mother:String,father:String},
    dateOfBirth:String,
   dailyAttendance:String,
    paidAmount: Number
    	}
]
}]);


	appSchema.virtual('imagePath').get(function(){
	
	if(this.logo != null && this.logoType != null){return `data:${this.logoType};charset=utf-8;base64,${this.logo.toString('base64')}`}
	})
const records = mongoose.model('schools',appSchema );


app.post('/users',function (req,res){
	var username = req.body.username
	var password = req.body.password
 records.find({}, function (err,data){
  if (err) throw err;
 const userEmail = data[0].students.find( ({ email }) => email === username)
  const userEmailCheck = userEmail.email
  const userPassword = data[0].students.find( ({ pass }) => pass === password)
  const userPasswordCheck = userPassword.password
  
  if (userEmailCheck=== username && userPasswordCheck === password){
  	   	res.send('success':true) ;
  } else {
  	res.send('success':false) ;
  }
    });});
    
    
    
 
app.get('/allStudents/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('allStudents.ejs',{data:data, school:req.params.id}) ;
    });});
        

        
app.get('/profile/:id/:profile',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
 if (err) throw err;
  
    res.render('profile',{data:data, profile:req.params.profile ,school:req.params.id , d2:data[0].students.find( ({ idNumber }) => idNumber === req.params.profile) }) ;
     }); 
     
     
     });
        
app.get('/allTeachers/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('allTeachers.ejs',{data:data, school:req.params.id }) ;
    });});
    
    app.get('/textSmS/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('textSmS.ejs',{data:data, school:req.params.id }) ;
    });});
    
    app.get('/addStudent/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('addStudent.ejs',{data:data, school:req.params.id }) ;
    });});
    
    app.get('/addTeachers/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('addTeachers.ejs',{data:data, school:req.params.id }) ;
    });});
    
    app.get('/addFees/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('addFees.ejs',{data:data, school:req.params.id }) ;
    });});
    
    app.get('/feesCollection/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('feesCollection.ejs',{data:data, school:req.params.id }) ;
    });});
        
app.get('/events/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('events',{data:data, school:req.params.id}) ;
    });});
        
app.get('/home',checkAuthenticated,function (req,res){
 records.find({_id:req.user.id}, function (err,data){
  if (err) throw err;
   res.render('home',{data:data , id:req.user.id , d3:data[0].students}) ;
    });});
        
app.get('/sms',function (req,res){
 records.find({}, function (err,data){
  if (err) throw err;
   res.render('smsGateway') ;
    });});
        
   
 app.get('/',checkNotAuthenticated, function (req,res){
 records.find({}, function (err,data){
  if (err) throw err;
  res.render('index', {data:data})
  initializePassport(
passport,
email => data.find(user => user.email === email),
id => data.find(user => user.id === id) )

 }) ;
 
    });  
    

app.post('/addStudent/:id',urlencodedParser,  async (req,res)=>{ 
     var dt = req.body.dt
	 var ffr = req.body.sid
	 var amn = req.body.amn
	 var knt = req.body.knt
	 var pyd = req.body.pyd
	 var af = req.body.af
	
	if ( dt.constructor == Array ){var one = req.body.dt}
	else if ( dt.constructor !== Array ){var one = [req.body.dt]}
	if ( ffr.constructor == Array ){var two = req.body.sid}
	else if ( ffr.constructor !== Array ){var two = [req.body.sid]}
	if ( amn.constructor == Array ){var three = req.body.amn}
	else if ( amn.constructor !== Array ){var three = [req.body.amn]}
	if ( knt.constructor == Array ){var four = req.body.knt}
	else if ( knt.constructor !== Array ){var four = [req.body.knt]}
	if ( pyd.constructor == Array ){var five = req.body.pyd}
	else if ( pyd.constructor !== Array ){var five = [req.body.pyd]}
	if ( af.constructor == Array ){var six = req.body.af}
	else if ( af.constructor !== Array ){var six = [req.body.af]}
	
	 var chk = ""
	  for (a=0;a< one.length;a++){
	     chk += `{date:"${ one[a]}", form:"${ two[a]}",amount:${three[a]}, contact:${ four[a]}, paidBy:"${five[a]}", actualfee:${six[a]}  },`
	    }
	     var aray = chk 
	     var nwy = aray.length -1 
            var wch = aray.slice(0, nwy) ;
            var objectStri = (new Function("return [" + wch+ "];")());
 
let studentsArray 

var mother = req.body.moLi
  var father = req.body.foLi
   if ( mother.constructor == Array ){var mom = req.body.moLi}
    else if ( mother.constructor !== Array ){var  mom = [req.body.moLi]}
     if ( father.constructor == Array ){var dad = req.body.foLi}
	  else if ( father.constructor !== Array ){var dad = [req.body.foLi]}
	   var see = ""
	    for (aa=0;aa<  mom.length;aa++){
	     see += `{mother:"${  mom[aa]}",  father:"${dad[aa]}"},`
	      }
	       var arra = see 
	        var ne = arra.length -1 
             var wat = arra.slice(0, ne) ;
              var occupation = (new Function("return [" + wat+ "];")());
               var real = occupation[0]
            
    
studentsArray = await records.findById(req.params.id)
 studentsArray.students = studentsArray.students.concat(
    {city: req.body.city,
    address: req.body.address,
    firstName:req.body.name,
    surname: req.body.surname,
    idNumber: req.body.id,
    sports: req.body.sports,
    clubs: req.body.clubs,
    contacts:req.body.contacts,
    email: req.body.email,
    password: req.body.password,
    age:req.body.dob,
	parentName:req.body.parents,
	gender:req.body.gender,
	stream:req.body.streams,
	className:req.body.classesName,
    house:req.body.house,
    newStudent:req.body.newstudent,
    previousSchools:req.body.pschool,
    parentOccupation:real,
    payments:objectStri
    })


   
try{
 await studentsArray.save(function(err,data){
	 if (err) throw err;
	  })
  res.redirect(`/allStudents/${req.params.id}`)
   }catch {
	if(studentsArray== null){
	 res.redirect('/index')}
      }
 

 })	


app.post('/addTeachers/:id',urlencodedParser,  async (req,res)=>{
	
	var sp = ""
	var cl = ""
	
	
	var orts = req.body.sports 
	var bs = req.body.clubs
	if ( orts.constructor == Array ){var te = req.body.sports}
	else if ( orts.constructor !== Array ){var te = [req.body.sports]}
	if ( bs.constructor == Array ){var at = req.body.clubs}
	else if ( bs.constructor !== Array ){var at = [req.body.clubs]}
	
    for (z=0;z<  te.length;z++){
	     sp += `["${ te[z]}"],`
	     cl += `["${ at[z]}"],` }
	     
	 
	var n = sp.length -1 
    var sprts = sp.slice(0, n) ;
 
	var nn = cl.length -1 
    var clbs = cl.slice(0, nn) ;
   
    
    
var date = req.body.date
	 var time = req.body.time
	  var duty = req.body.duty
	
	if ( date.constructor == Array ){var tesy = req.body.date}
	else if ( date.constructor !== Array ){var tesy = [req.body.date]}
	if ( time.constructor == Array ){var ant = req.body.time}
	else if ( time.constructor !== Array ){var ant = [req.body.time]}
	if ( duty.constructor == Array ){var an = req.body.duty}
	else if ( duty.constructor !== Array ){var an = [req.body.duty]}
	
	 var check = ""
	  for (a=0;a< tesy.length;a++){
	     check += `{duty:"${ tesy[a]}", time:"${ant[a]}",date:"${an[a]}" },`
	    }
	     var array = check 
	     var newy = array.length -1 
            var watch = array.slice(0, newy) ;
            var ectStringArray = (new Function("return [" + watch+ "];")());	 
     
let teachersArray 
const hashPassword = await bcrypt.hash(req.body.password,10)
teachersArray = await records.findById(req.params.id)
 teachersArray.teachers = teachersArray.teachers.concat(
    {name: req.body.tname,
    address: req.body.taddress,
    surname: req.body.tsurname,
    contact:req.body.tcontacts,
    email: req.body.temail,
    password: hashPassword,
    extraCurricular:{Sports:sprts,Clubs:clbs},
	duties:ectStringArray,
	subjectsTaken: req.body.id
	
    })
try{
 await teachersArray.save(function(err,data){
	 if (err) throw err;
	  })
  res.redirect(`/allTeachers/${req.params.id}`)
   }catch {
	if(teachersArray== null){
	 res.redirect('/index')}
      }
 

 })	

app.post('/sms',urlencodedParser, async (req,res)=>{
	
	
	
	var mon = ""
	var tue = ""
	var wed = ""
	var thu = ""
	var fri = "" 
	
	var mtime = req.body.monTime 
	var msubjectTaken = req.body.monPeriod
	var mclassname = req.body.monClass
	var ctime = req.body.tueTime 
	var csubjectTaken = req.body.tuePeriod
	var cclassname = req.body.tueClass 
	var wtime = req.body.wedTime 
	var wsubjectTaken = req.body.wedPeriod
	var wclassname = req.body.wedClass 
	var ttime = req.body.thuTime 
	var tsubjectTaken = req.body.thuPeriod 
	var tclassname = req.body.thuClass
	var ftime = req.body.friTime
	var fsubjectTaken = req.body.friPeriod
	var fclassname = req.body.friClass 
	
    for (z=0;z< mtime.length;z++){
	     mon += `["${ mtime[z]}", "${ msubjectTaken[z]}","${ mclassname[z]}"],`
	     tue += `["${ ctime[z]}", "${ csubjectTaken[z]}","${ cclassname[z]}"],`
	     wed += `["${ wtime[z]}", "${ wsubjectTaken[z]}","${ wclassname[z]}"],`
	     thu += `["${ ttime[z]}", "${ tsubjectTaken[z]}","${ tclassname[z]}"],`
	     fri += `["${ ftime[z]}", "${ fsubjectTaken[z]}","${ fclassname[z]}"],` }
	     
	var e = mon 
	var n = e.length -1 
    var w = e.slice(0, n) ;
    var onday = (new Function("return [" + w+ "];")());
    
    var ee = tue 
	var nn = ee.length -1 
    var ww = ee.slice(0, nn) ;
    var uesday = (new Function("return [" + ww+ "];")());
    
    var eee = wed 
	var nnn = eee.length -1 
    var www = eee.slice(0, nnn) ;
    var ednesday = (new Function("return [" + www+ "];")());
    
    var eeee = thu 
	var nnnn = eeee.length -1 
    var wwww = eeee.slice(0, nnnn) ;
    var hursday = (new Function("return [" + wwww+ "];")());
    
    var eeeee = fri 
	var nnnnn = eeeee.length -1 
    var wwwww = eeeee.slice(0, nnnnn) ;
    var riday = (new Function("return [" + wwwww+ "];")());

	
	var testArray = req.body.school
	 var aamnt = req.body.amount
	
	if ( testArray.constructor == Array ){var tesy = req.body.school}
	else if ( testArray.constructor !== Array ){var tesy = [req.body.school]}
	
	if ( aamnt.constructor == Array ){var ant = req.body.amount}
	else if ( aamnt.constructor !== Array ){var ant = [req.body.amount]}
	
	 var check = ""
	  for (a=0;a< tesy.length;a++){
	     check += `{type1:"${ tesy[a]}", amount:${ant[a]}},`
	    }
	     var array = check 
	     var newy = array.length -1 
            var watch = array.slice(0, newy) ;
            var objectStringArray = (new Function("return [" + watch+ "];")());
            
const hashedPassword = await bcrypt.hash(req.body.password,10)
const newrecords = records(
{name:req.body.name,
classesName:req.body.test,
streams:req.body.streams,
fees:objectStringArray ,
address:req.body.address,
contact:req.body.contact,
email:req.body.email,
password:hashedPassword,
timeShedule:req.body.timeschedule,
subjects:req.body.subjects,
classes:{Monday:onday,Tuesday:uesday,Wednesday:ednesday,Thursday:hursday,Friday:riday},
principal:req.body.principal,
principalContact:req.body.principalContact,
houses:req.body.houses,
paymentStatus:req.body.status,
sports:req.body.sports,
clubs:req.body.clubs
})  
saveImage(newrecords,req.body.cover)        
     try{
 	const newRecord  = await newrecords.save(function(err,data){
	 if (err) throw err;
	  })
		/res.redirect('/')
		}
	 catch{
	res.redirect('/sms')}
	
			 }) 
        
 function saveImage(newrecords, coverEncoded){
 	if(coverEncoded == null) return
 	const cover = JSON.parse(coverEncoded)
 	if(cover != null){
	newrecords.logo = new Buffer.from(cover.data, 'base64')
	newrecords.logoType = cover.type	
	}
 }

 
app.post('/',urlencodedParser,passport.authenticate('local',{  
successRedirect: '/home' ,
failureRedirect:'/' ,
failureFlash:true

}))

app.delete('/logout', (req,res)=>{
	req.logOut()
	res.redirect('/')
})
  