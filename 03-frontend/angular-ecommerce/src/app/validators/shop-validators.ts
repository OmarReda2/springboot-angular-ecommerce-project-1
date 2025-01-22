import { FormControl, ValidationErrors } from '@angular/forms';
export class ShopValidators {

    static notOnlyWhiteSpaces(control: FormControl):ValidationErrors|null{

        // check if string only contain whitespaces
        if((control.value != null)&&(control.value.trim().length==0)){

            return {'notOnlyWhiteSpaces':true}
        }else{
            return null;
        }

    }
}

