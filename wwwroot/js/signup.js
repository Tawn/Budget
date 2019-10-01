function sign_up(){
    var email = document.getElementById("input_email").value;
    var password = document.getElementById("Password").value;
    var first = document.getElementById("input_firstname").value;
    var last = document.getElementById("input_lastname").value;
    var promise;
    var target_url = "api/users/add";
    var data = 
    { 
        "Email": email,
        "Password": password,
        "lastName": last,
        "firstName": first
    };
    console.log(data);

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
        localStorage.setItem("Guid", data.guid);
      });

    
    window.location = "/login"
}