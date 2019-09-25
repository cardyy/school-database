const express = require('express');
const app = express();
const bodyParser = require ('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:false})
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config.js')
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
	
	
app.listen(3000);


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cardyy:spoon1989@cluster0-mxvqy.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.connection.once('open', function(){
    console.log('connection made');

}).on('error', function(error){
    console.log('connection error', error)
})
const appSchema = new mongoose.Schema({
  
    name: String,
    email: String,
    password:  String
    
});

const records = mongoose.model('records',appSchema );

 


app.get('/allStudents/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('allStudents.ejs',{data:data, school:req.params.id}) ;
    });});
        

        
app.get('/profile/:id/:profile',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
 if (err) throw err;
  res.render('profile',{data:data, profile:req.params.profile ,school:req.params.id }) ;
   });});
        
app.get('/allTeachers/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('allTeachers.ejs',{data:data, school:req.params.id}) ;
    });});
        
app.get('/events/:id',checkAuthenticated,function (req,res){
 records.find({_id:req.params.id}, function (err,data){
  if (err) throw err;
   res.render('events',{data:data, school:req.params.id}) ;
    });});
        
app.get('/home',checkAuthenticated,function (req,res){
 records.find({_id:req.user.id}, function (err,data){
  if (err) throw err;
   res.render('home',{data:data , id:req.user.id}) ;
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
console.log(data)
 }) ;
 
    });  
    
    
   

app.post('/sms',urlencodedParser, async (req,res)=>{
 try{
  const hashedPassword = await bcrypt.hash(req.body.password,10)
const newrecords = records({name:req.body.name,email:req.body.email,password:hashedPassword}).save(function(err,data){
	 if (err) throw err;
	  })
		/res.redirect('/')}
	 catch{
	res.redirect('/sms')}
		 })
        
   
 




 
app.post('/',urlencodedParser,passport.authenticate('local',{  
successRedirect: '/home' ,
failureRedirect:'/' ,
failureFlash:true

}))

app.delete('/logout', (req,res)=>{
	req.logOut()
	res.redirect('/')
})
  