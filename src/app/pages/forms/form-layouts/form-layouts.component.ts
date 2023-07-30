import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "ngx-form-layouts",
  styleUrls: ["./form-layouts.component.scss"],
  templateUrl: "./form-layouts.component.html",
})
export class FormLayoutsComponent {
  inlineForm = this.fb.group({
    name: "",
    email: "",
  });

  usersList$ = this.http.get("https://jsonplaceholder.typicode.com/users");
  currentUser$ = this.http.get("https://jsonplaceholder.typicode.com/users/1");

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  onInlineFormSubmit(): void {
    const name = this.inlineForm.get("name").value;
    const email = this.inlineForm.get("email").value;

    this.http
      .post("https://jsonplaceholder.typicode.com/users", {
        name,
        email,
      })
      .subscribe();
  }
}
