import {Component} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    public deviceID :string = '';
    public scanResult = '';
    public devicesList = [];
    public alertResponse : any;
    public wifiList = [];
    public inputs = [];

    public uuidConfig  = {
        "deviceUUID": "27dc2bcf-6492-476a-b63a-4e419d417a9f",
        "serviceUUID": "c640efa6-489e-4694-bfed-73ce0fa15e77",
        "writeCharacteristicWriteUUID": "d973a488-84f8-4df0-ac83-929dd2fb3bd8",
        "readStatusUUID": "4d549010-bc4c-401a-b9e7-ad486c99ab21",
        "notificationUUID": "8fa7b756-4b3f-43bf-bd15-613b04025d72"
    };

    constructor(
        private ble: BLE ,
        public alertController: AlertController,
        public toastController: ToastController
    ) {}

    removeDups(names) {
        let unique = {};
        names.forEach(function(i) {
            if(!unique[i]) {
                unique[i] = true;
            }
        });
        return Object.keys(unique);
    }

    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }
    str2ab(str) {
        let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        let bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    scan() {
        this.wifiList = [];
        (<HTMLInputElement> document.getElementById("disableMe")).disabled = true;
        this.presentToast('Scanning ...').then(r => console.log('Scanning ...'))

        this.scanResult = '';
        this.devicesList = [];
        let devices = [];
        this.ble.scan([], 10).subscribe(device => {
            this.scanResult = `${JSON.stringify(device)}.${this.scanResult}`;
            devices.push(device);
            this.devicesList = devices;
        });
        setTimeout( function() {
            (<HTMLInputElement> document.getElementById("disableMe")).disabled = false;
        }, 2000 );

    }

    async pickWifi() {
        this.removeDups(this.inputs)

        let pickWifiAlert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Select your Wi-Fi network',
            inputs: this.inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.disconnect(this.deviceID)
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (alertData) => {
                        this.connectToWifi(alertData)
                    }
                }
            ]
        });
        await pickWifiAlert.present();
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        await toast.present();
    }

    async connectToWifi(ssid) {
        await this.ble.stopScan();
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Connect to ' + ssid,
            inputs: [
                {
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.disconnect(this.deviceID)
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (alertData) => {

                        if (this.ble.isConnected)
                        {
                            console.log("WE ARE CURRENTLY CONNECTED");
                            let payload = this.str2ab(ssid + '|' + alertData.password);

                            this.ble.write(
                                this.deviceID,
                                this.uuidConfig.serviceUUID,
                                this.uuidConfig.writeCharacteristicWriteUUID,
                                payload
                            );
                            this.ble.read(
                                this.deviceID,
                                this.uuidConfig.serviceUUID,
                                this.uuidConfig.readStatusUUID,
                            ).then((data) => {
                                    let status = JSON.parse(new TextDecoder().decode(data))
                                    if(status.status !== "Success"){
                                        this.presentToast('Wrong password')
                                        alert.present()
                                    }
                                }
                            )
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    async connect(macAddress) {
        this.wifiList = [];
        this.inputs = [];
        let ssid = '';
        let wificounter = 0;

        console.log('Connect');
        this.deviceID = macAddress;
        this.ble.connect(macAddress).subscribe(deviceData => {
            this.ble.startNotification(this.deviceID, this.uuidConfig.serviceUUID, this.uuidConfig.notificationUUID).subscribe(
                (buffer) => {
                    ssid = new TextDecoder().decode(buffer)
                    this.wifiList.push(ssid)
                    if(ssid === "END"){
                        this.wifiList.pop()
                        this.wifiList.shift()
                        while(wificounter < this.wifiList.length){
                            this.inputs.push({
                                name: 'ssid',
                                type: 'radio',
                                label: this.wifiList[wificounter],
                                value: this.wifiList[wificounter],
                                checked: false
                            });
                            wificounter++
                        }
                        if(this.wifiList.length >= 2) {
                            this.pickWifi().then(r =>
                                console.log('Login alert')
                            );
                        }
                    }
                },
                (error) => this.alertResponse(error)
            )
        });
    }

    async disconnect(macAddress) {
        console.log('disconnect');
        const x = await this.ble.disconnect(macAddress);
        await this.presentToast('Disconnected')

        console.log(x);
        this.deviceID = '';
    }

}
