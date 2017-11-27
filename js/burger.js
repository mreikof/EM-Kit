//Custom JS
console.log("js is working");

$(document).ready(function(){
    $('a.target-burger').click(function(e){
        console.log("clicking is working");
        $('div.container, nav.main-nav, a.target-burger').toggleClass('toggled');
        e.preventDefault();
    });//target-burger-click
});//doc-rdy
