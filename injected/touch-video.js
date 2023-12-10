let TouchVideo = ()  => {
    //////////////////////////      config           //////////////////////////
    const SENSITIVITY = 10; // 滑动检测灵敏度
    const MOUSE_SPEED_DIFFERENCE_MAX = 10; // 滑动检查速度误差最大值
    const MOUSE_DIFFERENCE_MAX = 15; // 滑动检查允许误差最大值
    const IS_WIDESCREEN = true;  // 是否自动转宽屏播放

    ///////////////////////////////// MessageBox Content //////////////////////////////
    let videoContainer = document.querySelector("div.bpx-player-video-perch");
    let brightnessMsgBox = "div.bpx-player-brightness-hint";
    let msgContent = [
        {
            name : "div.bpx-player-brightness-hint", 
            html: "<div class=\"bpx-player-brightness-hint\" style=\"opacity: -0.998047; display: none;\">\n" +
            "    <span class=\"bpx-player-brightness-hint-icon\">\n" +
            "<svg t=\"1693548893046\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"12816\"><path d=\"M861.76 364.16v-195.2h-195.2L528.64 31.04l-137.92 137.92H180.48v210.24L32 528l148.48 148.48v195.2h195.2l137.92 137.92 137.92-137.92h210.24v-210.24l148.48-148.8-148.48-148.48zM533.76 810.56V205.12c167.04 0 302.72 135.36 302.72 302.72 0 167.04-135.36 302.72-302.72 302.72z\" fill=\"#2c2c2c\" p-id=\"12817\"></path></svg>" +
            "    </span>\n" +
            "    <span class=\"bpx-player-brightness-hint-text\">100%</span>\n" +
            "</div>"
        },
        {
            name: "div.bpx-player-volume-hint",
            html: "<div class=\"bpx-player-volume-hint\" style=\"opacity: -0.998047; display: none;\">\n" +
            "    <span class=\"bpx-player-volume-hint-icon\">\n" +
            "    <svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" data-pointer=\"none\" style=\"display: none;\" viewBox=\"0 0 22 22\"><path d=\"M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path><path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path></svg><svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" data-pointer=\"none\" style=\"display: none;\" viewBox=\"0 0 22 22\"><path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path><path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path></svg></span>\n" +
            "    <span class=\"bpx-player-volume-hint-text\">100%</span>\n" +
            "</div>"
        }
    ]

    const UP = 'up', DOWN = 'down', LEFT = 'left', RIGHT = 'right', MIDDLE = 'middle';

    // 是否包含弹窗dom 不包含就追加
    function isDomContains(name){
        if (!document.querySelector(name)){
            let html = document.createElement("div");
            msgContent.forEach(function (item) {
                if (item.name == name){
                    html.innerHTML = item.html;
                }
            })
            let parent = "div.bpx-player-primary-area";
            document.querySelector(parent).appendChild(html);
        }
    }

    let volumeUpTimeoutId;
    // 弹窗显示
    function showMessageBox(name){
        isDomContains(name);
        let dom = document.querySelector(name);
        if (volumeUpTimeoutId){
            let arr = volumeUpTimeoutId.split('|');
            if (arr[0] != name){
                document.querySelector(arr[0]).setAttribute("style", "opacity: 0; display: none;");
            }
            clearTimeout(arr[1]);
        }
        dom.setAttribute("style", "opacity: 1;");
    }

    // 弹窗隐藏
    function hideMessageBox(name){
        let dom = document.querySelector(name);
        volumeUpTimeoutId = name + "|";
        volumeUpTimeoutId += setTimeout(function () {
            let i = 1024;
            let j = 0;
            let timer = setInterval(function(){
                j ++;
                i -= 2 ** j;
                if(i <= 0){
                    dom.setAttribute("style", "opacity: 0; display: none;");
                    clearInterval(timer);
                }
                dom.style.opacity = i / 1024;
            }, 1);
        }, 1000);
    }

    // 点击显示视频信息
    let showVideoInfoTimeId = null;
    let showVideoInfoTimeFlag = null;
    function showVideoInfo(){
        // 每秒触发一次
        if (showVideoInfoTimeId){
            clearInterval(showVideoInfoTimeId);
            showVideoInfoTimeId = null;
        }
        let player = document.querySelector("div.bpx-player-container");
        showVideoInfoTimeFlag = 1;
        player.classList.remove('bpx-state-no-cursor');
        player.setAttribute('data-ctrl-hidden', 'false');
        player.querySelector('div.bpx-player-control-entity').setAttribute('data-shadow-show','false');
        let bpxPlayerPbp = player.querySelector('div.bpx-player-control-entity > div.bpx-player-pbp');
        if (bpxPlayerPbp){
            player.querySelector('div.bpx-player-control-entity > div.bpx-player-pbp').classList.add('show');
        }
        
    }
    // 隐藏
    function hideVideoInfo(){
        showVideoInfoTimeFlag = 2;
        showVideoInfoTimeId = setTimeout((showVideoInfoTimeFlag) => {
            console.log(showVideoInfoTimeFlag);
            let player = document.querySelector("div.bpx-player-container");
            player.classList.add('bpx-state-no-cursor');
            player.setAttribute('data-ctrl-hidden', 'true');
            player.querySelector('div.bpx-player-control-entity').setAttribute('data-shadow-show','true');
            let bpxPlayerPbp = player.querySelector('div.bpx-player-control-entity > div.bpx-player-pbp');
            if (bpxPlayerPbp){
                player.querySelector('div.bpx-player-control-entity > div.bpx-player-pbp').classList.remove('show');
            }

        }, 1400);
        
    }

    let mOutEvt = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    let mOverEvt = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    let mEnterEvt = new MouseEvent('mouseenter', {
        bubbles: false,
        cancelable: true,
        view: window
    });
    let mLeaveEvt = new MouseEvent('mouseleave', {
        bubbles: false,
        cancelable: true,
        view: window
    });
    let mMoveEvt = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: 500,
        clientY: 400,
        pageX: 500,
        pageY: 400
    });

    function playOrPause(){
        document.querySelector("div.bpx-player-ctrl-play").click();
    }

    function getVideo(){
        let video = videoContainer.querySelector("video"); 
        if (!video){
            video = videoContainer.querySelector("bwp-video");
            console.log("音量:"+ document.querySelector("bwp-video").volume);
        }
        return video;
    }

    // 获取当前播放时间
    function getCurrentTime(){
        return getVideo().currentTime;
    }

    // 设置播放时间
    function setCurrentTime(value){
        let video = getVideo();
        value = value > video.duration ? video.duration : value < 0 ? 0 : value;
        video.currentTime = value;
        
        // bpx-player-container
    }

    // 获取当前音量
    function getVolume(){
        let volume = Math.round(getVideo().volume * 100);
        // let volume = parseInt(document.querySelector("div.bpx-player-ctrl-volume-number").innerHTML);
        return volume;
    }

    // 设置音量
    let setVolume = (volume) => {
        let msgBox = "div.bpx-player-volume-hint";
        showMessageBox(msgBox);
        
        volume = volume > 100 ? 100 : volume;
        volume = volume < 0 ? 0 : volume;
        getVideo().volume = volume * 0.01;
        // 静音
        if (volume == 0){
            document.querySelector("span.bpx-player-volume-hint-icon").firstElementChild.setAttribute("style", "display: none");
            document.querySelector("span.bpx-player-volume-hint-icon").lastElementChild.setAttribute("style","");
            document.querySelector("span.bpx-player-volume-hint-text").innerHTML = "静音";
        }
        else{ // 显示音量
            document.querySelector("span.bpx-player-volume-hint-text").innerHTML = volume + "%";
            document.querySelector("span.bpx-player-volume-hint-icon").lastElementChild.setAttribute("style", "display: none");
            document.querySelector("span.bpx-player-volume-hint-icon").firstElementChild.setAttribute("style","");
        }
        hideMessageBox(msgBox);
    }

    // 获取亮度
    let getBrightness = () => {
        isDomContains(brightnessMsgBox);
        let str = document.querySelector("span.bpx-player-brightness-hint-text").innerHTML;
        return parseInt(str.substring(0, str.length - 1));
    }

    // 设置亮度
    let setBrightness = (brightness) => {
        brightness = brightness > 100 ? 100 : brightness;
        brightness = brightness < 20 ? 20 : brightness;
        videoContainer.style.opacity = brightness * 0.01; // opacity : 0.1; 设置透明度
        showMessageBox(brightnessMsgBox);
        document.querySelector("span.bpx-player-brightness-hint-text").innerHTML = brightness + "%";
        hideMessageBox(brightnessMsgBox);

    }

    // 获取元素大小
    function getElementPageSize(element){
        w = element.clientWidth; // 视频宽
        h = element.clientHeight; // 视频高
        return {w: w, h: h};
    }

    // 获取元素坐标
    function getElementPagePosition(element){
        //计算x坐标
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        //计算y坐标
        let actualTop = element.offsetTop;
        let current1 = element.offsetParent;
        while (current1 !== null){
            actualTop += (current1.offsetTop+current1.clientTop);
            current1 = current1.offsetParent;
        }
        //返回结果
        return {x: actualLeft, y: actualTop}
    }

    let touchDoubleClickLastTime = 0;
    function init() {

        // 优化点击后显示进度操作 原先的消失太快了来不及操作
        let player = document.querySelector("div.bpx-player-container");
        let observer = new MutationObserver(mutations => {
            mutations.forEach(function(item){
                if(item.type == 'attributes' && item.attributeName == 'data-ctrl-hidden'){
                    if(showVideoInfoTimeFlag == 1 && player.getAttribute('data-ctrl-hidden') == 'true'){
                        showVideoInfo();
                        console.log(player.getAttribute('data-ctrl-hidden'));
                    }
                    else if(showVideoInfoTimeFlag == 2){
                        showVideoInfoTimeFlag = null;
                    }
                }
            })
            // => 返回一个监听到的MutationRecord对象
            // MutationRecord对象是每修改一个就会在数组里面追加一个
          });
        
        observer.observe(player, {attributes: true});
        // 点击视频 下方也显示控制区
        let playerControl = document.querySelector('div.bpx-player-control-wrap');
        playerControl.addEventListener('touchstart', (e) => {
            showVideoInfo();
        })
        playerControl.addEventListener('touchend', (e) => {
            hideVideoInfo();
        })
        let x, y;   //不要问为什么这里不像addTap1一样用设置attribute的方法保存listener里要用的外部变量，问就是写着太麻烦了，执行起来也麻烦。
        let countTouchmove; // 移动速度
        let touchStartTime, touchEndTime;
        let isTouchDoubleClick = false, isTouchmove = false;
        let clickPosition = '', direction = '';
        let videoPosition, videoSize;
        videoContainer.addEventListener('touchstart', (e) => {
            e.preventDefault(); //阻止触摸产生click事件，避免不想要的视频暂停
            showVideoInfo();
            x = e.touches[0].pageX; //保存触摸开始时的触点坐标
            y = e.touches[0].pageY;
            countTouchmove = 0;
            clickPosition = '';
            direction = '';
            isTouchmove = false;
            videoContainer.dispatchEvent(mEnterEvt);
            videoContainer.dispatchEvent(mOverEvt);
            videoContainer.dispatchEvent(mMoveEvt);
            touchStartTime = Date.now();
            if(touchStartTime - touchDoubleClickLastTime < 500){
                isTouchDoubleClick = true;
                touchDoubleClickLastTime = 0;
            }
            videoSize = getElementPageSize(videoContainer); // 视频大小
            videoPosition = getElementPagePosition(videoContainer); //视频坐标
            // console.log("w:" + videoSize.w + " h:" + videoSize.h);
            // console.log("dom-x:" + videoPosition.x + " dom-y:" + videoPosition.y)
            // 判断点击位置
            if (x < (videoSize.w / 3) + videoPosition.x ){ // 点击左半部分
                clickPosition = LEFT;
            }
            else if(x > (videoSize.w - (videoSize.w / 3)) + videoPosition.x){
                clickPosition = RIGHT;
            }
            else{
                clickPosition = MIDDLE;
            }
            // 提高焦点
            videoContainer.setAttribute("tabindex", "1");
            //bpx-player-volume-hint opacity: 1;
        })

        videoContainer.addEventListener('touchmove', (e) => {   //滑动快进或回退、调节音量
            countTouchmove++;
            // 判断滑动方向
            let newX = e.touches[0].pageX;   
            let newY = e.touches[0].pageY;
            // 计算两点距离
            var space = Math.sqrt(Math.pow(Math.abs(x - newX),2)+Math.pow(Math.abs(y - newY),2));
            // console.log("space:" + space);
            if (space > SENSITIVITY){
                isTouchmove = true;
            }
            // 差值
            let deltaX = newX - x;
            let deltaY = newY - y;
            // 过滤: x or y 波动距离大于15 and 滑动次数大于15
            if (countTouchmove >= MOUSE_SPEED_DIFFERENCE_MAX && 
                (Math.abs(newX - x) > MOUSE_DIFFERENCE_MAX || Math.abs(newY - y) > MOUSE_DIFFERENCE_MAX)) {
                
                if (deltaY < -MOUSE_DIFFERENCE_MAX) {
                    direction = UP;
                }
                else if(deltaY > MOUSE_DIFFERENCE_MAX){
                    direction = DOWN;
                }
                else if(deltaX < -MOUSE_DIFFERENCE_MAX){
                    direction = LEFT;
                }
                else{
                    direction = RIGHT;
                }
            }
            
            // 设置音量+
            if (clickPosition == RIGHT && direction == UP){
                if (deltaY < 0 && space > SENSITIVITY){
                    // document.querySelector("bwp-video").volume = 0.33;
                    setVolume(getVolume() + 5); //提高音量
                    x = newX;
                    y = newY;
                }
            }
            // 设置音量-
            else if(clickPosition == RIGHT && direction == DOWN){
                if (deltaY > 0 && space > SENSITIVITY){
                    // document.querySelector("bwp-video").volume = 0.22;
                    setVolume(getVolume() -5); //降低音量
                    x = newX;
                    y = newY;
                }
            }
            // 设置亮度+
            else if(clickPosition == LEFT && direction == UP){
                if (deltaY < 0 && space > SENSITIVITY){
                    setBrightness(getBrightness() +5);
                    x = newX;
                    y = newY;
                }
            }
            // 设置亮度-
            else if(clickPosition == LEFT && direction == DOWN){
                if (deltaY > 0 && space > SENSITIVITY){
                    setBrightness(getBrightness() -5);
                    x = newX;
                    y = newY;
                }
            }
            // 设置进度+
            else if(direction == RIGHT){
                if (deltaX > 0 && space > SENSITIVITY){
                    setCurrentTime(getCurrentTime() + 1);
                    x = newX;
                    y = newY;
                }
            }
            // 设置进度-
            else if(direction == LEFT){
                if (deltaX < 0 && space > SENSITIVITY){
                    setCurrentTime(getCurrentTime() - 1);
                    x = newX;
                    y = newY;
                }
            }

        })

        videoContainer.addEventListener('touchend', (e) => {
            hideVideoInfo();
            touchEndTime =  Date.now();
            // 单击
            let time = touchEndTime - touchStartTime;
            if(time < 600 && !isTouchmove){
                touchDoubleClickLastTime = touchEndTime;
                if(isTouchDoubleClick){ // 双击执行
                    playOrPause();
                    isTouchDoubleClick = false;
                }
            }
            else if(time < 10000 && !isTouchmove){ // 长按
                // videoContainer.
                // videoContainer.dispatchEvent('contextmenu');
            }
        })
        
    }
    init();
}
TouchVideo();