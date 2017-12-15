/**
 * 窗口程序
 */
import { observable, computed, autorun } from "mobx"

export default class ObservableStore {
  // 是否是迷你窗口
  @observable isMini = false;
  electron = null;
  size = {
    Content: null,
    Minimum: null,
    
  };
  constructor() {
    if (window["require"]) {
      this.electron = window["require"]("electron");
    }
  }
  onMini(mini?) {
    if ("undefined" === typeof mini) {
      this.isMini = !this.isMini;
    } else {
      if (this.isMini != mini) {
        this.isMini = mini;
      }
    }
  }
  getSize() {
    if (this.electron) {
      this.size = this.electron.remote.app.win.getSize();
      console.log(this.size);
    }
  }
  openExternal(url) {
    if (this.electron) {
      this.electron.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }
  // 删除 cookie
  emptyCookie() {
    if (this.electron) {
      const { cookies } = this.electron.remote.session.defaultSession;
      const { origin } = window.location;

      cookies.get({ url: origin }, (err, cks) => {
        err && console.error(err);
        cks && cks.map(x => {
          cookies.remove(origin, x.name, r => {
            console.log("remove cookies ");
          })
        })
      });
    }
  }
  onMinus() {
    if (this.electron) {
      this.electron.remote.app.win.minimize();
    }
  }
  onAlt() {
    if (this.electron) {
      const win = this.electron.remote.app.win;
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  }
  onClose() {
    if (this.electron) {
      this.electron.remote.app.exit();
    }
  }
}



