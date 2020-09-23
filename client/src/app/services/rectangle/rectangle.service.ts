//tslint:disable:prettier
import { Injectable } from '@angular/core';
import { DrawingService } from '../drawing/drawing.service';
import { Vec2 } from '../../classes/vec2';
import { Tool } from '../../classes/tool'

 export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
 }
 export enum DrawingType{
  fill = 'fill',
  stroke = 'stroke',
  outline='outline'
  }

 @Injectable({
   providedIn: 'root'
 })
   
 export class RectangleService extends Tool {
   shiftPressed: boolean
   mouseDown: boolean
   lineWidth: number=5
   lastPoint: Vec2
   firstPoint: Vec2
   drawingType: string = 'outline'
   primaryColor: string = 'red'
   secondaryColor:string='green'
   constructor(drawingService:DrawingService) {
     super(drawingService);
     this.shiftPressed=false;
     this.mouseDown=false;
   }
 
   setLineWidth(width:number): void{
     this.lineWidth=width;
   }
 
 onMouseDown(event:MouseEvent): void{
 
   this.mouseDown=event.button===MouseButton.Left;
     if(this.mouseDown){
       this.firstPoint=this.getPositionFromMouse(event);
     }
 }
 
 onMouseUp(event:MouseEvent): void{
   if(this.mouseDown){
     this.lastPoint=this.getPositionFromMouse(event);
     const topLeftPoint=this.findTopLeftPoint(this.firstPoint,this.lastPoint);
     this.drawRectangle(this.drawingService.baseCtx,topLeftPoint);
   }
   this.mouseDown=false;
 }
 
 onMouseMove(event:MouseEvent): void{
   if(this.mouseDown){
     this.lastPoint=this.getPositionFromMouse(event);
     this.drawingService.clearCanvas(this.drawingService.previewCtx);
     const topLeftPoint=this.findTopLeftPoint(this.firstPoint,this.lastPoint);
     this.drawRectangle(this.drawingService.previewCtx, topLeftPoint);
   }
 }
 

 
 onKeyUp(event:KeyboardEvent): void{
   this.shiftPressed=false;
   if(this.mouseDown){
     this.drawingService.clearCanvas(this.drawingService.previewCtx);
     const topLeftPoint=this.findTopLeftPoint(this.firstPoint,this.lastPoint);
     this.drawRectangle(this.drawingService.previewCtx,topLeftPoint);
   }
 }
 

 private drawRectangle(ctx:CanvasRenderingContext2D,point:Vec2): void{
 
   let width:number;
   let height:number;
 
   if(this.shiftPressed){
     width=height=this.rectangleWidth;
     if(width>ctx.canvas.width-point.x){
       point.x=point.x-width+this.width;
     }
 
     if(width>ctx.canvas.height-point.y){
       point.y=point.y-width+this.height;
     }
   }else if(this.width===0&&this.height===0){
     return;
 
   }else{
     width=this.width;
     height=this.height;
   }
 
   switch (this.drawingType) {
 
     case DrawingType.fill:
       ctx.fillStyle=this.primaryColor;
       ctx.fillRect(point.x,point.y,width,height);
       break;
 
       case  DrawingType.stroke:
         ctx.lineWidth=this.lineWidth;
         ctx.strokeStyle=this.primaryColor;
         ctx.strokeRect(point.x,point.y,width,height);
         break;
 
         case DrawingType.outline:
           width=Math.max(this.width,2*this.lineWidth);
           height=Math.max(this.height,2*this.lineWidth);
           ctx.lineWidth=this.lineWidth;
           ctx.fillStyle=this.primaryColor;
           ctx.fillRect(point.x,point.y,width,height);
           ctx.clearRect(point.x+this.lineWidth,point.y+this.lineWidth,Math.abs(width-2*this.lineWidth),Math.abs(height-2*this.lineWidth));
           ctx.fillStyle=this.secondaryColor;
           ctx.fillRect(point.x+this.lineWidth,point.y+this.lineWidth,Math.abs(width-2*this.lineWidth),Math.abs(height-2*this.lineWidth));
           break;
 
       default:
         break;
     }
 }
 
     /*
     to find the top left point of the rectangle or the square
     */
 private findTopLeftPoint(point1:Vec2,point2:Vec2): Vec2{
   let x=point1.x;
   let y=point1.y;
  // in the left edge
   if (point1.x > point2.x && point1.y > point2.y) { 
     // Left up corner 
       x=point2.x;
       y=point2.y;
   } else if (point1.x > point2.x && point1.y < point2.y) {
     // right up corner
     x=point2.x;
     y=point1.y;
   }else if(point1.x<point2.x&&point1.y>point2.y){
     x=point1.x;
     y=point2.y;
   }
 
   return { x, y };
 }
 
 get width(): number{
   return Math.abs(this.firstPoint.x-this.lastPoint.x);
 }
 
 get height(): number{
   return Math.abs(this.firstPoint.y-this.lastPoint.y);
 }
 
 get rectangleWidth(): number{
     return this.width>this.height?this.width:this.height;
   }
 }

 //  onKeyDown(event:KeyboardEvent): void{
//    this.shiftPressed=event.keyCode===Keyboard.shift;
//    if (this.shiftPressed&&this.mouseDown){
//      this.drawingService.clearCanvas(this.drawingService.previewCtx);
//      const topLeftPoint=this.findTopLeftPoint(this.firstPoint,this.lastPoint);
//      this.drawRectangle(this.drawingService.previewCtx,topLeftPoint);
//    }
//  }