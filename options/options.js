let widescreenOption = document.getElementById("widescreen")
let options = { widescreen : true };
chrome.storage.local.get('widescreen', function(result) {
    if (result.widescreen == undefined){
        chrome.storage.local.set(options)
    }
    else{
        options = result
        widescreenOption.value = result.widescreen;
    }
 });

function selectChange(){
    options.widescreen = widescreenOption.options[widescreenOption.selectedIndex].value
    chrome.storage.local.set(options, function() {
        document.getElementById("log").innerHTML = "保存成功！";
    })
}
let button = document.getElementById('submit');
button.addEventListener('click', selectChange)