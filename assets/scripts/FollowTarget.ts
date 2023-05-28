import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FollowTarget")
export class FollowTarget extends Component {
  @property(Node)
  player: Node;

  start() {}

  update(deltaTime: number) {
    this.onFollowTarget();
  }

  onFollowTarget() {
    // //处理相机左右抖动问题
    let dis = Math.abs(this.player.position.x - this.node.position.x);
    if (dis < 3) return;
    this.node.setPosition(this.player.position.x, 0);
  }
}
