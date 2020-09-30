import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AttributePanelComponent } from './components/attribute-panel/attribute-panel.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawingDetailComponent } from './components/drawing-detail/drawing-detail.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { GeneralDetailComponent } from './components/general-detail/general-detail.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawingComponent } from './components/new-drawing/new-drawing.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrushAttributesComponent } from './components/tools/brush-attributes/brush-attributes.component';
import { CircleAttributesComponent } from './components/tools/circle-attributes/circle-attributes.component';
import { EraserAttributesComponent } from './components/tools/eraser-attributes/eraser-attributes.component';
import { LineAttributesComponent } from './components/tools/line-attributes/line-attributes.component';
import { PencilAttributesComponent } from './components/tools/pencil-attributes/pencil-attributes.component';
import { SliderComponent } from './components/tools/shared-Attributes/slider/slider.component';
import { TypeOfFillSelectionComponent } from './components/tools/shared-Attributes/type-of-fill-selection/type-of-fill-selection.component';
import { SquareAttributesComponent } from './components/tools/square-attributes/square-attributes.component';
import { UserguideComponent } from './components/userguide/userguide.component';
@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        UserguideComponent,
        DrawingDetailComponent,
        GeneralDetailComponent,
        AttributePanelComponent,
        BrushAttributesComponent,
        CircleAttributesComponent,
        EraserAttributesComponent,
        LineAttributesComponent,
        PencilAttributesComponent,
        SliderComponent,
        SquareAttributesComponent,
        UserguideComponent,
        NewDrawingComponent,
        ColorPickerComponent,
        TypeOfFillSelectionComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatDialogModule,
        MatTabsModule,
        MatSliderModule,
        MatTooltipModule,
        MatIconModule,
        MatExpansionModule,
        FormsModule,
        MatCheckboxModule,
        MatInputModule,
    ],
    entryComponents: [UserguideComponent, MainPageComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
