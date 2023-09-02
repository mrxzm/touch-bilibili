// b站主页
class Bili{
    init(){  //适用于旧版哔哩哔哩（当前主要版本）
        if (!document.querySelector("#biliMainHeader")){
            return;
        }
        let selectors=[];
        // console.log(document.querySelector("#internationalHeader"))
        if(document.querySelector("#internationalHeader")){//旧版网页
            selectors = [//顶部导航栏右侧的动态、收藏、历史三个元素
                "#internationalHeader > div.mini-header.m-header > div > div.nav-user-center > div.user-con.signin > div:nth-child(4) > div",//动态
                "#internationalHeader > div.mini-header.m-header > div > div.nav-user-center > div.user-con.signin > div:nth-child(5) > span > div.mini-favorite.van-popover__reference",//收藏
                "#internationalHeader > div.mini-header.m-header > div > div.nav-user-center > div.user-con.signin > div:nth-child(6) > span > div.mini-history.van-popover__reference"//历史
            ]
        }
        else{//新版网页
            selectors=[
                "div.bili-header ul.right-entry > li:nth-child(3) > a",
                "div.bili-header ul.right-entry > li:nth-child(4) > a",
                "div.bili-header ul.right-entry > li:nth-child(5) > a",
                "div.bili-header ul.right-entry > li:nth-child(6) > a"
            ]
            //  > svg
        }
        this.execute(selectors, this.optimize);
        
    }

    execute(selectors, action){
        var readyState = document.readyState;
        if(readyState === 'interactive' || readyState === 'complete') {
            for (let i in selectors) {
                let times = 1;
                let selector = selectors[i];
                let interval = setInterval(() => {
                    try {
                        let element = document.querySelector(selector)
                        if (element) {
                            action(element);
                            clearInterval(interval);
                        }
                        else if (times >= 30) {
                            clearInterval(interval);
                            throw ('加载失败-> ' + selector);
                        }
                        else {
                            times++;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }, 300);
            }
            
        }
        
    }

    btnClick(elem) {
        elem.click();
    }

    optimize(elem) {
        elem.setAttribute("touch-flag", '0');
        elem.addEventListener('touchstart', (e) => {
            e.preventDefault(); //使触摸事件结束后不默认产生后续鼠标事件
            if (elem.getAttribute('touch-flag') == '0') {
                elem.dispatchEvent(new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                elem.setAttribute("touch-flag", '1');
            }
            else {
                elem.dispatchEvent( new MouseEvent('mouseleave', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                elem.setAttribute("touch-flag", '0');
            }
        });
    }

}

window["touch-bili"] || (function () { window["touch-bili"] = true; new Bili().init(); })();