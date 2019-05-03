const SERVICE_UUID = 'f6740539-e7ee-47bc-926b-adfa5150e1a2'
const CHARACTERISTIC_UUID = '3d7c94ca-0522-4287-94a7-8913e7e63beb'

const btn = document.getElementById('btn')
const text = document.getElementById('text')
const counter = document.getElementById('counter')

// click button and start connection
btn.addEventListener('click', (event) => {
  connect()
})

const connect = () => {
  // Scan
  navigator.bluetooth.requestDevice({
    acceptAllDevices: false,
    filters: [
      { namePrefix: 'knockmitten' }
    ],
    optionalServices: [
      // 使用したいServiceを登録
      SERVICE_UUID
    ]
  })
    // 接続
    .then(device => device.gatt.connect())
    // Service取得
    .then(server => server.getPrimaryService(SERVICE_UUID))
    // Characteristic取得
    .then(service => service.getCharacteristic(CHARACTERISTIC_UUID))
    // Notificationsを開始
    .then(characteristic => setNotifications(characteristic))
    // Errorはこちら
    .catch(error => console.log(error))
}

// Notification設定
const setNotifications = (characteristic) => {

  // Add Event
  characteristic.addEventListener('characteristicvaluechanged', (event) => {
    const value = event.target.value

    // データをパース
    const decoder = new TextDecoder('utf-8')
    const str = decoder.decode(value)
    const json = JSON.parse(str)
    console.log(json)
    // データを表示
    if (text) {
      text.innerHTML = json.pulse
      counter.innerHTML = json.counter
      updateColor() // 色を変更
    }
  })

  // Notifications開始
  characteristic.startNotifications()
}

//
// p5js
//

// for red, green, and blue color values
let r, g, b;

function setup() {
  var canvas = createCanvas(1000, 400);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  background(255, 0, 200);
  // Pick colors randomly
  r = random(255);
  g = random(255);
  b = random(255);
}

function draw() {
  background(255);
  // Draw a circle
  strokeWeight(2);
  stroke(r, g, b);
  fill(r, g, b, 127);
  ellipse(360, 200, 100, 100);
  ellipse(30, 30, 50, 50);
  ellipse(30, 230, 30, 30);
  ellipse(160, 100, 50, 50);
  line(160, 200, 300, 400)
  line(280, 100, 500, 150)
  ellipse(560, 100, 30, 30);
  ellipse(360, 50, 20, 20);
  triangle(230, 275, 258, 220, 286, 275);
}

// When the user clicks the mouse
function updateColor() {
  // Pick new random color values
  r = random(255);
  g = random(255);
  b = random(255);
}