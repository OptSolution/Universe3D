/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-15 11:52:14
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-15 20:11:41
 */

export class U3dModelMenu {
  Vertices: number;
  Faces: number;
  Visible: boolean;
  Remove: Function;

  constructor() {
    this.Vertices = 0;
    this.Faces = 0;
    this.Visible = true;
  }
}