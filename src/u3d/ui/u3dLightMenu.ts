/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-15 23:06:55
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-16 12:54:40
 */

export class U3dLightMenu {
  Type: string;
  Bind: string;

  Color: string;
  Intensity: number;
  Distance: number;
  Decay: number;
  Position_x: number;
  Position_y: number;
  Position_z: number;

  Visible: boolean;
  Remove: Function;

  constructor() {
    this.Type = 'AmbientLight';
    this.Bind = 'Scene';

    this.Color = '#ffffff';
    this.Intensity = 1.0;

    // Point Light
    this.Distance = 0.0;
    this.Decay = 1;
    this.Position_x = 0.0;
    this.Position_y = 0.0;
    this.Position_z = 0.0;

    this.Visible = true;
  }
}

export class U3dAddLightMenu {
  AddLight: Function;
  Cancel: Function;
  Next: Function;
  Save: Function;

  constructor() {

  }
}