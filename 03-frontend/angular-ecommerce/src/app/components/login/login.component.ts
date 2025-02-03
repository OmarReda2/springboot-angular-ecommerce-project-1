import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from 'src/app/config/my-app-config';
import {OktaSignIn} from '@okta/okta-signin-widget'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{

  oktaSignin:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth){
    
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oicd.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oicd.clientId,
      rediredtUri: myAppConfig.oicd.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oicd.issuer,
        scopes: myAppConfig.oicd.scopes
      }
    });
   }

  
  ngOnInit(): void { }
  
}
