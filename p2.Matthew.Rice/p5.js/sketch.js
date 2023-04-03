//DISPLAY API
let curr_temp
let curr_name
let curr_short_forecast
let curr_icon

let capture;
let data1;
let data2;
let data3;
let color = "white";
let show = false;
let display = false;
let img;
let img2;
let key = "cf39bb64846b93595f440175712516b2"
let lat = 33.59;
let lng = -101.87;

// These change depending on how much information will be available in the csv file
var calendarY = 250;
var weightY = 395;

function preload() {
  data1 = loadTable('weight.csv', 'csv', 'header');
  data2 = loadTable('calendar.csv', 'csv', 'header');
  data3 = loadTable('news.csv', 'csv', 'header');
  img = loadImage("assets/light.png")
}

function setup() {
  background(255);
  createCanvas(1400, 900);
  capture = createCapture(VIDEO);
  capture.hide()
  lightbutton = new Button(width-150,height-170,img)
  color1 = new colorButton(width/2-25,height-200,"rgb(243,231,211)")
  color2 = new colorButton(width/2-75,height-200,"white")
  color3 = new colorButton(width/2+25,height-200,"#d8c894")
  color4 = new colorButton(width/2-75,height-150,"#867e36")
  color5 = new colorButton(width/2-25,height-150,"#0000FF")
  color6 = new colorButton(width/2+25,height-150,"#FF0000")
  panelTog = new ClosePanel(width/2+58,height-238,30,30, false)
  showTog = new ClosePanel(width/2-60,height-90,100,30, true)
  
  get_temp()
}

// Api for weather information
async function get_temp() {
    const response = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=cf39bb64846b93595f440175712516b2&units=imperial");
    const json = await response.json()
    console.log(json)
    curr_temp = json.main.temp
    curr_name = json.name
    curr_short_forecast = json.weather[0].description
    curr_icon = json.weather[0].icon
}

function draw() {
  background(0)
  
  // This will flip the webcam to simulate a mirror
  videoFlip()
  
  // The lightbar can have its color changed and can be toggled on or off with the panel
  if(show) {
    lightBar()
  }

  // Weather api
  weather()
  

  // Clock that updates live, digital seemed like the better option for this implementation
  clock()

  // First we check to see if the csv file has been loaded if it is not then don't load the info
  if (data1) {
    weight()
  }
  
  // Check if the personal calendar csv file loads, if not then do not call the function
  // Only 5 items will be displayed at a time
  if (data2) {
    calendar()
  }
  
  // Check if the news csv file loaded, if not then do not call it's function
  // Only 2 news items will display at a time
  if (data3) {
    news()
  }
  
  // This is the bottom right button
  if (!display) {
    lightbutton.display()
  }
  else {
    colorPanel()
  }
}

function mousePressed() {
  if (!display) {
    if (lightbutton.over()) {
      if(display) {
        display = false
      }
      else {
        display = true
      }
    }
  }
  else {
    if (color1.over()) {
      color = color1.getColor()
    }
    else if (color2.over()) {
      color = color2.getColor()
    }
    else if (color3.over()) {
      color = color3.getColor()
    }
    else if (color4.over()) {
      color = color4.getColor()
    }
    else if (color5.over()) {
      color = color5.getColor()
    }
    else if (color6.over()) {
      color = color6.getColor()
    }
    else if (panelTog.over()) {
      display = false;
    }
    else if (showTog.over()) {
      if(show) {
        show = false;
      }
      else {
        show = true;
      }
    }
  }
}

// Choose what color you want to be used for the light bar, and choose to turn on the light bar
function colorPanel() {
  fill("#9E9E9E")
  rect(width/2-110,height-240,200,200)
  color1.display()
  color2.display()
  color3.display()
  color4.display()
  color5.display()
  color6.display()
  
  panelTog.display()
  fill("red")
  text("X",width/2+67,height-220)
  
  showTog.display()
  if(show) {
    fill("black")
    text("Turn Off",width/2-42,height-75)
  }
  else {
    fill("white")
    text("Turn On",width/2-42,height-75)
  }
}

// Display the current whether data for from the API
function weather() {
  stroke(0)
  strokeWeight(3)
  img2 = createImg("https://openweathermap.org/img/wn/"+curr_icon+"@2x.png", "assets/light.png");
  img2.hide()
  
  textSize(48)
  fill("white");
  
  textAlign(CENTER,CENTER)
  text(curr_name, width-147,200)
  textAlign(RIGHT, CENTER)
  
  textSize(40)
  text(curr_temp, width-130, 250)
  textSize(18)
  textAlign(CENTER,CENTER)
  text("O", width-120, 230)
  text(curr_short_forecast, width-160, 280)
  image(img2,width-135, 193)
  strokeWeight(1)
}

// Live Update Clock
function clock() {
  stroke(0)
  strokeWeight(3)
  fill("white");
  let date = new Date();

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  day = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']

  textAlign(CENTER, CENTER)
  textSize(28)
  let Hour = hour()
  let min = minute()
  let secs = second()
  let m = month()
  let noon = Hour >= 12? " PM" : " AM"
  if(min < 10)
      min = "0"+min
  if(secs < 10)
      secs = "0"+secs
  if(Hour > 12)
      Hour = Hour-12
  text(day[date.getDay()]+", "+months[date.getMonth()]+" "+date.getDate(), width-150, 75)
  text(Hour+":"+min+":"+secs+noon, width-150, 110)
  strokeWeight(1)
}

// Load and display the weight data
function weight() {
  let numRows = data1.getRowCount();
  let weights = data1.getColumn('weight');
  
  stroke(0)
  strokeWeight(3)
  
  fill("white");
  textAlign(LEFT, CENTER)
  textSize(22)
  
  text("Weight:",75,calendarY)//250
  text(weights[0]+" lbs",320,calendarY)
  
  stroke(255)
  strokeWeight(2)
  line(65,calendarY+20,400,calendarY+20)//270
  stroke(0)
  strokeWeight(3)
  
  textSize(18)  
  text("Yesterday:",75,calendarY+40)
  text(weights[1]+" lbs",330,calendarY+40)
  
  text("Last Week:",75,calendarY+60)
  text(weights[numRows-1]+" lbs",330,calendarY+60)
  
  weightY = calendarY+135
  strokeWeight(1)
}

// show up to 5 upcoming calendar events
function calendar() {
  let numRows = data2.getRowCount();
  let dates = data2.getColumn('date');
  let event = data2.getColumn('event');
  let correctCount;
  strokeWeight(3)
  
  if (numRows > 5) {
    correctCount = 5
  }
  else {
    correctCount = numRows
  }
  
  calendarY = (115+((correctCount-1)*30))+75
  
  stroke(0)
  fill("white");
  textAlign(LEFT, CENTER)
  textSize(22)
  text("Calendar",75,75)
  
  strokeWeight(2)
  stroke(255)
  line(65,95,400,95)
  strokeWeight(3)
  
  stroke(0)
  textSize(18)
  for (let i = 0; i < correctCount; i++) {
    textAlign(LEFT, CENTER)
    text(event[i],75,115+(i*30))
    text(dates[i],300,115+(i*30))
    
  }
  strokeWeight(1)
}

// This will only show the two first news posts.
function news() {
  let numRows = data3.getRowCount();
  let title = data3.getColumn('title');
  let desc = data3.getColumn('description');
  let correctCount;
  strokeWeight(3)
  
  if (numRows > 2) {
    correctCount = 2
  }
  else {
    correctCount = numRows
  }
  
  stroke(0)
  fill("white");
  textAlign(LEFT, CENTER)
  textSize(22)
  text("News",75,weightY)//395
  
  strokeWeight(2)
  stroke(255)
  line(65,weightY+20,400,weightY+20)//415
  strokeWeight(3)
  
  stroke(0)
  for (let i = 0; i < correctCount; i++) {
    textSize(32)
    text(title[i],75,(weightY+50)+(i*120))//445
    textSize(18)
    text(desc[i],75,(weightY+60)+(i*120),350,100)
  }
  strokeWeight(1)
}

function lightBar() {
  fill(color)
  noStroke()
  rect(25,height-50, width-50, 25)
  rect(25, 25, width-50, 25)
  rect(width-50, 25, 25, height-50)
  rect(25, 25, 25, height-50)
}

function videoFlip() {
  translate(1400, 0);
  scale(-1,1)
  image(capture, 0, 0, 1400, 900);
  translate(1400,0);
  scale(-1,1)
}


class colorButton {
  constructor(inX, inY, inColor) {
    this.x = inX;
    this.y = inY;
    this.color = inColor;
  }
  
  display() {
    stroke(0);
    fill(this.color)
    rect(this.x,this.y,30,30)
  }
  
  over() {
    if (mouseX > this.x && mouseX < this.x + 30 && mouseY > this.y && mouseY < this.y + 30) {
      return true;
    } else {
      return false;
    }
  }
  
  getColor() {
    return this.color;
  }
}

class ClosePanel {
  constructor(inX, inY, inW, inH, inL) {
    this.x = inX;
    this.y = inY;
    this.h = inH;
    this.w = inW;
    this.L = inL;
  }
  
  display() {
    stroke(0);
    
    if(this.over() && !this.L) {
      fill("gray")
      noStroke()
    }
    else if (!this.L) {
      fill("#9E9E9E")
      noStroke()
    }
    if(this.L && show) {
      fill("green")
    }
    else if(this.L && !show) {
      fill("red")
    }
    rect(this.x,this.y,this.w,this.h)
    stroke(0);
  }
  
  over() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      return true;
    } else {
      return false;
    }
  }
}

class Button {
  
  constructor(inX, inY, inImg) {
    this.x = inX;
    this.y = inY;
    this.img = inImg;
  }
  
  display() {
    stroke(0);
    
    if (show) {
      tint(255,255,0);
    }
    else {
      noTint();
    }
    
    image(this.img, this.x, this.y,100,100);
  }
  
  over() {
    if (mouseX > this.x && mouseX < this.x + this.img.width && mouseY > this.y && mouseY < this.y + this.img.height) {
      return true;
    } else {
      return false;
    }
  }
}
