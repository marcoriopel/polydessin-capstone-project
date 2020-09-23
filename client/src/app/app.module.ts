import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AttributePanelComponent } from './components/attribute-panel/attribute-panel.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrushAttributesComponent } from './components/tools/brush-attributes/brush-attributes.component';
import { CircleAttributesComponent } from './components/tools/circle-attributes/circle-attributes.component';
import { EraserAttributesComponent } from './components/tools/eraser-attributes/eraser-attributes.component';
import { LineAttributesComponent } from './components/tools/line-attributes/line-attributes.component';
import { PencilAttributesComponent } from './components/tools/pencil-attributes/pencil-attributes.component';
import { SliderComponent } from './components/tools/shared-Attributes/slider/slider.component';
import { SquareAttributesComponent } from './components/tools/square-attributes/square-attributes.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        AttributePanelComponent,
        PencilAttributesComponent,
        BrushAttributesComponent,
        SquareAttributesComponent,
        CircleAttributesComponent,
        LineAttributesComponent,
        EraserAttributesComponent,
        SliderComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatSliderModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
