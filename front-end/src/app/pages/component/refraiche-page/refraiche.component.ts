import { Component } from "@angular/core";
import { closeModal } from "src/app/helper/helper-function";

@Component({
  selector: 'app-refraiche',
  templateUrl: './refraiche.component.html',
})
export class RefraicheComponent{


  refraichePage(){
    window.location.reload();
  }

  closePopup (){
    closeModal("refraiche-page")
  }
}
