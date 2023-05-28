import { Vec3 } from "cc";
import { UITransform } from "cc";
import { _decorator, Component, EventTouch, Node } from "cc";
import { Player } from "./Player";
const { ccclass, property } = _decorator;

@ccclass("Rocker")
export class Rocker extends Component {
  @property(Node)
  ctrl: Node;

  /**
   * stickman对象
   */
  @property(Node)
  player: Node;

  /**
   * 最大移动范围
   */
  @property
  limitR: number = 24;

  playerScript: Player = null;

  onLoad() {
    //获取Stickman的脚本组件
    this.playerScript = this.player.getComponent(Player);

    // 监听触摸事件
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  start() {}

  /**
   * 当手指触点落在目标节点区域内时。
   */
  private onTouchStart(event: EventTouch) {
    const worldPos = event.getLocation();
    // 转换为该节点的坐标
    const nodePos = this.node
      .getComponent(UITransform)
      .convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y, 0));

    // 控制ctrl移动范围
    const len = nodePos.length();
    if (len > this.limitR) {
      nodePos.x = (this.limitR * nodePos.x) / len;
      nodePos.y = (this.limitR * nodePos.y) / len;
    }
    this.ctrl.setPosition(nodePos);
    this.playerScript.setDir(this.ctrl.position.x);
  }

  /**
   * 当手指在屏幕上移动时。
   */
  private onTouchMove(event: EventTouch) {
    const worldPos = event.getLocation();
    const nodePos = this.node
      .getComponent(UITransform)
      .convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y, 0));
    const len = nodePos.length();
    if (len > this.limitR) {
      nodePos.x = (this.limitR * nodePos.x) / len;
      nodePos.y = (this.limitR * nodePos.y) / len;
    }
    this.ctrl.setPosition(nodePos);
    this.playerScript.setDir(this.ctrl.position.x);
  }

  /**
   * 当手指在目标节点 区域内 离开屏幕时。
   */
  private onTouchEnd(event: EventTouch) {
    // 离开屏幕时将ctrl归位
    this.ctrl.setPosition(0, 0, 0);
    this.playerScript.stopMove();
  }

  /**
   * 当手指在目标节点 区域外 离开屏幕时。
   */
  private onTouchCancel(event: EventTouch) {
    // 离开屏幕时将ctrl归位
    this.ctrl.setPosition(0, 0, 0);
    this.playerScript.stopMove();
  }

  update(deltaTime: number) {}

  onDestroy() {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }
}
