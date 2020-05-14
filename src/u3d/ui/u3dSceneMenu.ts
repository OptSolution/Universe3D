/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 23:35:01
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-14 23:35:18
 */

export class U3dSceneMenu {
  background: string;
  // axis
  showAxis: boolean;
  axisLength: number;
  //grid
  showGrid: boolean;
  gridSize: number;
  gridDivisions: number;
  gridColorCenterLine: string;
  gridColorGrid: string;

  constructor() {
    this.background = '#f0f0f0';

    this.showAxis = false;
    this.axisLength = 0.3;

    this.showGrid = false;
    this.gridSize = 1;
    this.gridDivisions = 10;
    this.gridColorCenterLine = '#444444';
    this.gridColorGrid = '#888888';
  }
}