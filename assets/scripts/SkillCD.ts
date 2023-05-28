import { _decorator, Button, Component, Label, Node, Sprite } from "cc";
import { Player } from "./Player";
const { ccclass, property } = _decorator;

/**
 * 技能cd
 */
@ccclass("SkillCD")
export class SkillCD extends Component {
  @property(Node)
  btnNode: Node = null;

  @property(Label)
  countdownLabel: Label = null;

  @property(Player)
  player: Player = null;

  @property
  cooldownDuration: number = 10; // 技能冷却时间（秒）

  isCoolingDown: boolean = false;
  currentCooldown: number = 0;

  btnSkill: Button;
  btnSkillSrite: Sprite;
  start() {
    this.btnSkillSrite = this.btnNode.getComponent(Sprite);
    this.btnSkill = this.btnNode.getComponent(Button);
  }

  update(deltaTime: number) {}

  startCooldown() {
    this.isCoolingDown = true;
    this.currentCooldown = this.cooldownDuration;
    this.btnSkill.interactable = false;
    this.btnSkillSrite.setEntityOpacity(100);
    this.schedule(this.updateCooldown, 1); // 每隔1秒更新一次倒计时
  }

  updateCooldown() {
    this.currentCooldown--;
    if (this.currentCooldown <= 0) {
      this.btnSkill.interactable = true;
      this.isCoolingDown = false;
      this.btnSkillSrite.setEntityOpacity(150);
      this.unschedule(this.updateCooldown);
      this.countdownLabel.string = ""; // 倒计时结束后清空文本
    } else {
      this.countdownLabel.string = this.currentCooldown.toString(); // 更新倒计时文本
    }
  }

  onSkill() {
    if (!this.isCoolingDown) {
      //技能冷却
      this.startCooldown();
      //释放技能
      this.player.attack();
    }
  }
}
