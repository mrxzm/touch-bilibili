// b站av视频页面
class BiliVideo extends Bili{
    init(){
        let bottomBtns = [
            "div.bpx-player-ctrl-quality",
            "div.bpx-player-ctrl-playbackrate",
            "div.bpx-player-ctrl-volume",
            "div.bpx-player-ctrl-setting",
            // "div.bpx-player-ctrl-subtitle",
        ];
        let videoBtns = [
            "div.bpx-player-ctrl-wide" // 宽屏按钮
        ];
        super.execute(videoBtns, super.btnClick);
        super.execute(bottomBtns, super.optimize);
    }
}
window["touch-bili-video"] || (function () { window["touch-bili-video"] = true; new BiliVideo().init();})();
