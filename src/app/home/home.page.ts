import {Component} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {AlertController} from '@ionic/angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public scanResult = '';
  public devicesList = [];
  public results = [];
  public alertResponse = '';
  private wifiList: Hotspot;

  constructor(
      private ble: BLE ,
      public alertController: AlertController,
  ) {}

  scan() {
    (<HTMLInputElement> document.getElementById("disableMe")).disabled = true;

    this.scanResult = '';
    this.devicesList = [];
    let devices = [];
    this.ble.scan([], 5).subscribe(device => {
      this.scanResult = `${JSON.stringify(device)}.${this.scanResult}`;
      const adData = new Uint8Array(device.advertising);
      // alert(device.name + " " + device.id + " " + device.rssi);
      devices.push(device);
      this.devicesList = devices;
    });
    setTimeout( function() {
      (<HTMLInputElement> document.getElementById("disableMe")).disabled = false;
      // alert(this.devicesList);
    }, 2000 );

  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Connect to your Wi-fi',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            this.alertResponse = JSON.stringify(alertData);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
  async getNetworks() {
    this.wifiList.scanWifi().then((networks: HotspotNetwork[]) => {
      alert(networks);
    });
  }

  async connect(macAddress) {
    console.log('Connect');
    this.ble.connect(macAddress).subscribe(x => {
      console.log(x);
      this.presentAlertPrompt().then(r =>
          console.log("Login alert")
      )
    });
  }

  async disconnect(macAddress) {
    console.log('disconnect');
    const x = await this.ble.disconnect(macAddress);
    console.log(x);
  }

}
