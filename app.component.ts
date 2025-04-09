import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;
  accessToken: string | null = null;  // Variable to hold the extracted access token
  refreshToken: string | null = null;  // Variable to hold the extracted refresh token
  redirectUrl: string | null = null;  // Variable to hold the extracted refresh token

  constructor(private fb: FormBuilder) {
    // Initialize the form in the constructor
    this.form = this.fb.group({
      localhostUrl: ['', [Validators.required]],  // Localhost URL field with required validation
      curlValue: ['', [Validators.required]]     // cURL field with required validation
    });
  }

  // Submit function for Localhost URL
  submitLocalhostUrl() {
    if (this.form.valid) {
      const localhostUrl = this.form.value.localhostUrl;
      console.log('Localhost URL Submitted:', localhostUrl);
    }
  }

  // Submit function for cURL Value
  submitCurlValue() {
    if (this.form.valid) {
      const curlValue = this.form.value.curlValue;
      console.log('cURL Submitted:', curlValue);

      // Extract tokens from cURL value
      this.extractTokensFromCurl(curlValue);

    }
  }

  extractTokensFromCurl(curlValue: string) {
    const accessTokenRegex = /access_token=([^&\s]+)/;
    const refreshTokenRegex = /refresh_token=([^&\s]+)/;

    const accessTokenMatch = curlValue.match(accessTokenRegex);
    const refreshTokenMatch = curlValue.match(refreshTokenRegex);

    const clean = (token: string | undefined) =>
      token ? token.replace(/[\\'"]+$/, '') : 'Not found';

    this.accessToken = clean(accessTokenMatch?.[1]);
    this.refreshToken = clean(refreshTokenMatch?.[1]);

    console.log('Extracted Access Token:', this.accessToken);
    console.log('Extracted Refresh Token:', this.refreshToken);
  }



  redirectToUrl() {
    if (this.form.valid && this.accessToken && this.refreshToken) {
      const localhostUrl = this.form.value.localhostUrl;

      // Create the URL with tokens
      console.log('accessToken', this.accessToken)
      this.redirectUrl = `${localhostUrl}?accessToken=${this.accessToken}&refreshToken=${this.refreshToken}`;

      // Redirect to the new URL in a new tab
      window.open(this.redirectUrl, '_blank');
      console.log('hereeeee',this.redirectUrl)
    } else {
      alert('Please make sure the form is valid and tokens are extracted');
    }
  }
}
