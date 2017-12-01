import { observable, computed, autorun, useStrict } from "mobx"
// useStrict(true);
import { Http, Help } from "../../utils"
import Store from "../index";
import notification from "antd/lib/notification";
// import { notification } from "antd";
export default class ObservableStore {
    // 音乐播放标签
    audio = document.createElement("audio");
    // @observable Store = {};
    // 播放列表 没有播放地址
    @observable playList = [];
    // 当前播放的音乐索引
    @observable currentIndex = 0;
    // 当前播放的音乐 源数据  地址  歌词 详情
    @observable current: any = {};
    // 歌曲地址
    @observable url = "";
    // 播放状态
    @observable playState = false;
    // 当前播放位置
    @observable currentProportion = 0;
    @observable currentTime = "00:00";
    @observable currentTimeS = 0;//毫秒位置
    // 歌曲长度
    @observable duration = 0;
    @observable durationTime = "00:00";
    // 歌曲缓存长度
    @observable cacheTime = 0;
    // 播放模式  循环 loop 随机 random  单曲 single 
    @observable pattern = "loop";
    // 播放器样式 footer  screen
    @observable patternStyle = "footer";
    // 显示播放列表
    @observable showList = false;
    // 显示歌词
    @observable showLyric = false;
    controller;
    constructor(controller) {
        this.controller = controller;
        this.audio.autoplay = true;
        this.addEventListener();
    }

    /**
     * 设置播放地址
     * @param url 
     */
    setUrl(url) {
        this.url = url;
        if (this.url && this.audio.src != this.url) {
            this.audio.src = this.url;
        }
    }
    /**
     * 显示播放列表
     */
    updateShowList() {
        this.showList = !this.showList;
    }
    /**
   * 显示歌词
   */
    updateShowLyric() {
        this.showLyric = !this.showLyric;
    }
    /**
     * 设置播放状态
     * @param state 
     */
    updatePlayState(state = true) {
        if (!this.duration) {
            return
        }
        this.playState = state;
        if (this.playState) {
            if (this.audio.paused) {
                this.audio.play();
            }
        } else {
            if (!this.audio.paused) {
                this.audio.pause();
            }
        }
    }
    /**
     * 修改 播放位置
     * @param proportion 比例 
     */
    updateCurrentTime(proportion) {
        if (!this.duration) {
            return
        }
        this.audio.currentTime = this.duration * proportion;
    }
    /**
     * 修改播放模式
     * @param pattern 
     */
    updatePattern(pattern) {
        if (this.pattern == pattern) {
            return;
        }
        if (pattern == "loop" || pattern == "random" || pattern == "single") {
            this.pattern = pattern;
        } else {
            throw "pattern = loop || random || single";
        }
    }
    /**
     * 修改播放器样式
     * @param style 
     */
    updatePatternStyle(style) {
        if (this.patternStyle == style) {
            return;
        }
        if (style == "footer" || style == "screen") {
            this.showList = false;
            this.patternStyle = style;
        } else {
            throw "patternStyle = footer || screen";
        }
    }
    /**
     * 添加播放事件
     */
    addEventListener() {
        // 当浏览器开始查找音频/视频时
        this.audio.addEventListener("loadstart", e => {


        });
        // 当音频/视频的时长已更改时
        this.audio.addEventListener("durationchange", e => {


        });
        // 当浏览器已加载音频/视频的元数据时
        this.audio.addEventListener("loadedmetadata", e => {
            this.duration = this.audio.duration;
            this.durationTime = Help.DateFormat(this.duration * 1000, "mm:ss");
        });
        // 当浏览器已加载音频/视频的当前帧时
        this.audio.addEventListener("loadeddata", e => {


        });
        // 当浏览器正在下载音频/视频时
        this.audio.addEventListener("progress", e => {
            try {
                this.cacheTime = (this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration) * 100;
            } catch (error) {
            }
        });
        // 当浏览器可以播放音频/视频时
        this.audio.addEventListener("canplay", e => {


        });
        // 当浏览器可在不因缓冲而停顿的情况下进行播放时
        this.audio.addEventListener("canplaythrough", e => {

        });
        // 当音频/视频在已因缓冲而暂停或停止后已就绪时
        this.audio.addEventListener("playing", e => {


        });
        // 当音频/视频的播放速度已更改时
        this.audio.addEventListener("ratechange", e => {


        });
        // 当目前的播放位置已更改时
        this.audio.addEventListener("timeupdate", e => {
            if (!this.duration) {
                return
            }
            let currentProportion = (this.audio.currentTime / this.duration) * 100;
            if (currentProportion > 99.4) {
                currentProportion = 99.4;
            }
            this.currentTimeS = this.audio.currentTime * 1000;
            this.currentTime = Help.DateFormat(new Date(this.currentTimeS), "mm:ss");
            this.currentProportion = currentProportion;
        });
        // 当目前的播放列表已结束时
        this.audio.addEventListener("ended", e => {
            this.next(this.pattern);
        });
        //当浏览器尝试获取媒体数据，但数据不可用时
        this.audio.addEventListener("stalled", e => {

        });
        // 当在音频/视频加载期间发生错误时
        this.audio.addEventListener("error", e => {

        });
        // 开始播放
        this.audio.addEventListener("play", e => {
            this.updatePlayState(true);
        });
        //暂停
        this.audio.addEventListener("pause", e => {
            this.updatePlayState(false);
        });

    }


    /**
     * 加入播放列表
     * 如果播放列表已存在该歌曲跳过添加 直接播放 该歌曲。
     * @param playList 列表 
     * @param replace  替换整个播放列表   true 替换  默认false 累加
     */
    addPlayList(playList = [], replace = false) {
        // console.log(...playList);
        if (playList.length) {
            // 播放全部操作，替换整个播放列表。
            if (replace) {
                this.currentIndex = 0;
                this.playList = [...playList];
                this.play();
            } else {
                if (playList.length == 1) {
                    const music = playList[0];
                    // 需要播放的索引
                    let index = 0;
                    // 歌曲已经存在列表中 拿到这条数据索引 执行播放操作。 
                    const existence = this.playList.some((element, i) => {
                        const exis = element.id == music.id;
                        if (exis) {
                            index = i;
                        }
                        return exis;
                    });
                    if (existence) {
                        //歌曲存在列表中 不进行添加操作
                    } else {
                        this.playList.push(music);
                        index = this.playList.length - 1;
                    }
                    this.currentIndex = index;
                    this.play();
                } else {
                    this.playList = [...this.playList, ...playList];
                }
            }
            // console.log("addPlayList", this);
            return this.playList;
        }
    }

    /**
     * 计算索引
     * @param index 
     */
    computationalIndex(index = 0) {

    }
    /**
     * 上
     */
    last(pattern?) {
        this.currentIndex > 0 ? this.currentIndex-- : undefined;
        this.play();
    }
    /**
     * 下
     */
    next(pattern?) {
        this.currentIndex < this.playList.length ? this.currentIndex++ : this.currentIndex = 0;
        this.play();
    }
    /**
     * 播放歌曲
     * getMusic 获取歌曲地址
     * getLyric 获取歌词信息
     * 默认缓存下一首歌曲地址。
     */
    async play(currentIndex?) {
        if (currentIndex) {
            this.currentIndex = currentIndex;
        }
        let ids = [];
        // 当前歌曲
        const play = this.playList[this.currentIndex];
        // 缓存下一首
        const cachePlay = this.playList[this.currentIndex + 1];
        if (play && play.id) {
            ids.push(play.id);
            if (cachePlay && cachePlay.id) {
                ids.push(cachePlay.id);
            }
            const music = await Store.musicStore.getMusic(ids.join(","));
            const lyric = await Store.musicStore.getLyric(play.id);
            // console.log(music, lyric);
            if (music.code == -110) {
                notification["error"]({
                    message: '购买专辑',
                    description: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享',
                });
                // 下一首
                return this.next();
            }
            // await this.getMusic(ids.join(","));
            // await this.getLyric(play.id);
            // 存储当前播放歌曲信息
            this.current = {
                //歌词
                lyric: lyric,
                // 音乐地址信息
                music: music,
                // 歌曲信息
                play: this.playList[this.currentIndex],
            }
            this.setUrl(this.current.music.url);
        }

    }
}


