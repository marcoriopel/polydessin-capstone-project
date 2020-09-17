import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectionService {
  currentTool: string;

  constructor() { }

  onToolChange(toolName: string): void {
    this.currentTool = toolName;
    console.log(toolName);
  }

  getCurrentTool(): string {
    return this.currentTool;
  }
}
