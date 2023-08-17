window.addEventListener(
  "load",
  () => {
    const forms = document.getElementsByClassName("validation-form");

    Array.prototype.filter.call(forms, (form) => {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  },
  false
);

function popup_window(obj) {
  wobj = window.open("", "pwin");
  obj.target = "pwin";
  wobj.focus();
  return true;
}
