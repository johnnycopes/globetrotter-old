import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent } from './components/alert/alert.component';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ContainerComponent } from './components/container/container.component';
import { CounterComponent } from './components/counter/counter.component';
import { FixedSlideablePanelComponent } from './components/fixed-slideable-panel/fixed-slideable-panel.component';
import { FlipCardComponent } from './components/flip-card/flip-card.component';
import { FormComponent } from './components/form/form.component';
import { IconComponent } from './components/icon/icon.component';
import { InputComponent } from './components/input/input.component';
import { LinkComponent } from './components/link/link.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalComponent } from './components/modal/modal.component';
import { NestedCheckboxesComponent } from './components/nested-checkboxes/nested-checkboxes.component';
import { NestedCheckboxesGroupComponent } from './components/nested-checkboxes-group/nested-checkboxes-group.component';
import { RadioButtonsComponent } from './components/radio-buttons/radio-buttons.component';
import { TabComponent } from './components/tabset/tab/tab.component';
import { TabsetComponent } from './components/tabset/tabset.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent,
    ButtonComponent,
    CheckboxComponent,
    ContainerComponent,
    CounterComponent,
    FixedSlideablePanelComponent,
    FlipCardComponent,
    FormComponent,
    IconComponent,
    InputComponent,
    LoaderComponent,
    LinkComponent,
    ModalComponent,
    NestedCheckboxesComponent,
    NestedCheckboxesGroupComponent,
    RadioButtonsComponent,
    TabComponent,
    TabsetComponent,
  ],
  exports: [
    AlertComponent,
    ButtonComponent,
    CheckboxComponent,
    ContainerComponent,
    CounterComponent,
    FixedSlideablePanelComponent,
    FlipCardComponent,
    FormComponent,
    IconComponent,
    InputComponent,
    LoaderComponent,
    LinkComponent,
    ModalComponent,
    NestedCheckboxesComponent,
    NestedCheckboxesGroupComponent,
    RadioButtonsComponent,
    TabComponent,
    TabsetComponent,
  ]
})
export class SharedModule { }
