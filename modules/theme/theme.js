define(function (require, exports, module) {
    require("css!bootstrap/../../css/bootstrap.css");
    require("css!app/../../main.css");

    require("css!themes/theme-reset.css");
    require("css!./theme.css");

    var $ = require("jquery");
    // $().on( "click", function() {
    //     console.log( $( this ).text() );
    // });
    $().ready(function() {
        console.log("hello");
    });
});