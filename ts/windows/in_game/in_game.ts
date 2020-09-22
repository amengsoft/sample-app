import { AppWindow } from "../AppWindow";
import { OWGamesEvents } from "../../odk-ts/ow-games-events";
import { OWHotkeys } from "../../odk-ts/ow-hotkeys";
import { interestingFeatures, hotkeys, windowNames } from "../../consts";
import WindowState = overwolf.windows.WindowState;

// The window displayed in-game while a Fortnite game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
  private static _instance: InGame;
  private _lolGameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _infoLog: HTMLElement;

  private constructor() {
    super(windowNames.inGame);

    this._eventsLog = document.getElementById('eventsLog');
    this._infoLog = document.getElementById('infoLog');

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();

    this._lolGameEventsListener = new OWGamesEvents({
      onInfoUpdates: this.onInfoUpdates.bind(this),
      onNewEvents: this.onNewEvents.bind(this)
    },
      interestingFeatures);
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public run() {
    this._lolGameEventsListener.start();
  }

  private onInfoUpdates(info) {
    //this.logLine(this._infoLog, info, false);

    if(info.live_client_data && info.live_client_data.all_players) {
      this.displayAllPlayers(info.live_client_data.all_players);

    } else if(info.game_info) {
      this.displayTeamInfo(info.game_info.teams);
    }
    
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    const shouldLog = e.events.some(event => {
      return event.name != 'match_clock' &&
      event.name != 'physical_damage_dealt_player' &&
      event.name != 'magic_damage_dealt_player' &&
      event.name != 'true_damage_dealt_player'
    });

    if(shouldLog) {
      this.logLine(this._eventsLog, e, shouldLog);
    }
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const hotkeyText = await OWHotkeys.getHotkeyText(hotkeys.toggle);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async hotkeyResult => {
      console.log(`pressed hotkey for ${hotkeyResult.featureId}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }

    OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    console.log(`${log.id}:`);
    console.log(data);
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    const shouldAutoScroll = (log.scrollTop + log.offsetHeight) > (log.scrollHeight - 10);

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private displayTeamInfo(teamsString) {
    var teams = JSON.parse(decodeURI(teamsString));

    this.logLine(this._infoLog, teams, false);

    var chaos = document.createElement('div');
    var br = document.createElement('br');
    var order = document.createElement('div');

    for(var i = 0; i < teams.length; i++) {
      var player = teams[i];
      var src = "../../img/champions/" + player["champion"] + "Square.png"
      const img = document.createElement('img');
      img.src = src;
      img.title = player["champion"];
      img.width = 48;
      img.height = 48;

      
      if(player["team"] == 'ORDER') {
        order.appendChild(img);
      }
      else {
        chaos.appendChild(img);
      }
    }
    
    this._infoLog.appendChild(order);
    this._infoLog.appendChild(br);
    this._infoLog.appendChild(chaos);

  }

  private displayAllPlayers(playersString){
    var players = JSON.parse(playersString);
      for(var i = 0; i < players.length; i++){
        this.logLine(this._infoLog, players[i].championName, false);
      }
  }
}

InGame.instance().run();
