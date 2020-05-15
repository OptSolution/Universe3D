/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 23:35:01
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-15 11:57:02
 */

export class U3dSceneMenu {
  Background: string;
  // axis
  ShowAxis: boolean;
  AxisLength: number;
  //grid
  ShowGrid: boolean;
  gridSize: number;
  gridDivisions: number;
  gridColorCenterLine: string;
  gridColorGrid: string;

  constructor() {
    this.Background = '#f0f0f0';

    this.ShowAxis = false;
    this.AxisLength = 0.3;

    this.ShowGrid = false;
    this.gridSize = 1;
    this.gridDivisions = 10;
    this.gridColorCenterLine = '#444444';
    this.gridColorGrid = '#888888';
  }
}