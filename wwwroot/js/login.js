function log_in(){
    var email = document.getElementById("input_email").value;
    var password = document.getElementById("input_password").value;

    var target_url = "api/login";

    var data = 
    { 
        "Email": email,
        "Password": password,
    };

    fetch(target_url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        if (data.loginSuccessful){
            localStorage.setItem("Guid", data.userGuid);
            console.log(localStorage.getItem("Guid"));
            console.log("succssful login");
            window.location = "/budget";
        }
        else {
            console.log("unsuccssful login");
            var div = document.getElementById("wrong-password");

            // if first times wrong password, only the comment will show
            if (div.innerHTML.trim() == "<!-- div reserved for wrong password -->"){
                var text = document.createTextNode("Wrong email or password.");
                div.appendChild(text);
            }
        }
        
      });
}