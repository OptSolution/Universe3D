/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-15 11:52:14
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-16 20:12:55
 */

export class U3dModelMenu {
  Vertices: number;
  Faces: number;
  Visible: boolean;
  Remove: Function;

  // material
  Type: string;
  Color: string;
  ShadowSide: number; // ['FrontSide':0, 'BackSide':1, 'DoubleSide':2]
  VertexColors: boolean;

  FlatShading: boolean; // flat triangle
  Wireframe: boolean;
  WireframeLinewidth: number;

  constructor() {
    this.Vertices = 0;
    this.Faces = 0;
    this.Visible = true;

    this.Type = 'MeshStandardMaterial';
    this.Color = '#DCF1FF';
    this.ShadowSide = 0;
    this.VertexColors = true;

    this.FlatShading = false;
    this.Wireframe = false;
    this.WireframeLinewidth = 1;
  }
}
