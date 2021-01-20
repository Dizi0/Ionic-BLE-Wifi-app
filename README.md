# Ionic BLE Wifi connector

Ionic BLE Wifi connector is an hybrid phone app designed to help you connect your RPI (or any linux device with bluetooth enabled) to a Wi-Fi Network.

You'll need to run a Node.Js script on the device you're willing to connect : 
[RpiBlenoWifiConnect](https://github.com/Dizi0/RpiBlenoWifiConnector) 

## Installation

This app requires Ionic to be installed : 

```bash
npm install -g @ionic/cli
```

Then, clone this repository
```
git clone https://github.com/Dizi0/Ionic-BLE-Wifi-app.git
```

And now, we need to install the project depedencies

```
cd Ionic-BLE-Wifi-app
npm install
```

## Usage

So far, this app was tested on Android, but it should work on iOS

Make sure you enabled [USB Debugging on android](https://developer.android.com/studio/debug/dev-options#enable), and plugged your phone via USB, 
then run : 

```bash
ionic cordova run android
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
