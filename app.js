const SERVICE_UUID = process.env.SERVICE_UUID
const CHARACTERISTIC_UUID = process.env.CHARACTERISTIC_UUID

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
    }
  })

  // Notifications開始
  characteristic.startNotifications()
}
