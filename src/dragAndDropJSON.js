/**
 * Drag and drop a json file containing information about the ROS
 * topics that need to be subscribed to. Drag and drop tested in 
 * Chrome.
 */
function DnDFileController(selector, onDropCallback) {
    var el_ = document.querySelector(selector);

    this.dragenter = function (e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add("dropping");
    };

    this.dragover = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };

    this.dragleave = function (e) {
        e.stopPropagation();
        e.preventDefault();
        //el_.classList.remove('dropping');
    };

    this.drop = function (e) {
        e.stopPropagation();
        e.preventDefault();

        el_.classList.remove("dropping");

        onDropCallback(e.dataTransfer.files, e);
    };

    el_.addEventListener("dragenter", this.dragenter, false);
    el_.addEventListener("dragover", this.dragover, false);
    el_.addEventListener("dragleave", this.dragleave, false);
    el_.addEventListener("drop", this.drop, false);
}

var dnd = new DnDFileController("body", function (files) {
    var f = files[0];

    if (!f.type.match("application/json")) {
        alert("Not a JSON file!");
    }

    var reader = new FileReader();
    reader.onloadend = function (e) {
        var result = JSON.parse(this.result);
        console.log(result);
    };
    reader.readAsText(f);
});
