
// 初始化js 将文件注入到网站中以获得最高执行权限
let interval = setInterval(() => {

    var readyState = document.readyState;
    if(readyState === 'interactive' || readyState === 'complete') {
        
        let file = chrome.runtime.getURL('injected/touch-video.js')
        let js = document.createElement('script')
        js.type = 'text/javascript'
        js.src = file
        document.documentElement.appendChild(js)

        clearInterval(interval)
    }

}, 200)