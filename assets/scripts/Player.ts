import {
  BoxCollider2D,
  Collider2D,
  Contact2DType,
  dragonBones,
  IPhysics2DContact,
  PhysicsSystem2D,
  RigidBody2D,
  Vec2,
} from "cc";
import { _decorator, Component } from "cc";
import { ANI_GROUP, ATTACK_LIST } from "./constants";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  /**
   * 方向变量 0不移动 1为右移动 -1为左移动
   */
  dir: number = 0;
  /**
   *  stickman移动速度
   */
  speed: number = 1;

  dirTime: number = 100;
  /**
   * 龙骨显示对象
   */
  armatureDisplay: dragonBones.ArmatureDisplay = null;
  /**
   * ArmatureDisplay 当前使用的 Armature 对象
   */
  armature: dragonBones.Armature;
  /**
   * 控制stickman的状态, 0待机 1奔跑
   */
  playerState: number = 0;
  /**
   * 刚体组件
   */
  rigidBody: RigidBody2D;

  /**
   * 跳跃速度，根据需要进行调整
   */
  jumpVelocity = 6;
  /**
   * 攻击CD
   */
  attackCD: number;

  /**
   * 攻击序号
   */
  attackNum: number = 0;

  /**
   * 是否可以跳跃
   */
  private canJump: boolean = true;
  /**
   * 已跳跃的次数
   */
  private jumpCount: number = 0;

  start() {
    // // 注册单个碰撞体的回调函数
    const collider = this.getComponent(BoxCollider2D);
    collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    // 获取龙骨动画组件
    this.armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
    this.armature = this.armatureDisplay.armature();

    // 监听动画播放完成，回到待机
    this.armatureDisplay.on(
      dragonBones.EventObject.COMPLETE,
      this.onComplete,
      this
    );

    // 获取stickman刚体组件
    this.rigidBody = this.node.getComponent(RigidBody2D);
  }

  update(deltaTime: number) {
    // this.aotuChangeDir();
    // if (this.attackCD > 0) {
    //   this.attackCD--;
    // }
    this.playerMove();
  }

  /**
   * 当角色与地面或其他平台碰撞时，重置跳跃次数
   */
  onBeginContact(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (other.node.name == "Ground") {
      this.jumpCount = 0;
    }
  }

  /**
   * stickman移动
   */
  playerMove() {
    // 平滑的移动
    if (this.speed <= 3) {
      this.speed += 0.1;
    }

    if (this.dir != 0) {
      if (this.playerState != 1) {
        this.playerState = 1;
        // 播放奔跑动画
        this.playAnim("奔跑");
      }

      const pos = this.node.position;
      switch (this.dir) {
        // 右移动
        case 1:
          this.node.setPosition(pos.x + this.speed, pos.y);
          break;
        // 左移动
        case -1:
          this.node.setPosition(pos.x - this.speed, pos.y);
          break;
      }
    }
  }

  /**
   * 设置stickman移动方向
   */
  setDir(xDir: number) {
    if (xDir > 0) {
      //右移动
      this.dir = 1;
      if (this.node.scale.x != -0.3) {
        const scale = this.node.scale;
        this.node.setScale(-0.3, scale.y, scale.z);
      }
    } else if (xDir < 0) {
      //左移动
      this.dir = -1;
      if (this.node.scale.x != 0.3) {
        const scale = this.node.scale;
        this.node.setScale(0.3, scale.y, scale.z);
      }
    }
  }

  /**
   * 取消移动
   */
  stopMove() {
    this.dir = 0;
    this.playerState = 0;
    this.playAnim("待机");
  }

  /**
   * 淡入播放指定的动画
   * @param animName
   */
  playAnim(animName: string) {
    // group - 混合组名称，该属性通常用来指定多个动画状态混合时的相互替换关系。 （默认: null）
    this.armature.animation.fadeIn(
      animName,
      -1,
      -1,
      0,
      ANI_GROUP,
      dragonBones.AnimationFadeOutMode.All
    );
  }

  /**
   * 动画播放完成的回调
   */
  onComplete() {
    // 播放待机动画
    this.playAnim("待机");
  }

  aotuChangeDir() {
    this.dirTime--;
    if (this.dirTime < 0) {
      // 随机时间
      this.dirTime = 50 + Math.floor(Math.random() * 101);
      //切换方向
      this.dir *= -1;
      this.speed = 0;
    }
  }

  /**
   * 斧师 - 跳跃
   */
  jump() {
    if (this.canJump) {
      if (this.rigidBody && this.jumpCount < 2) {
        const worldCenter = new Vec2();
        this.rigidBody.getWorldCenter(worldCenter);
        this.rigidBody.applyLinearImpulse(
          new Vec2(0, this.jumpVelocity),
          worldCenter,
          true
        );
        // 播放跳跃动画
        this.playAnim("普通跳跃");
        this.jumpCount++;
      }
    }
  }

  /**
   * 斧师 - 普通攻击
   */
  attack() {
    // if (this.attackCD > 0) {
    //   console.log("跳跃CD未刷新");
    //   return;
    // }
    // this.attackCD = 100;

    //每次攻击赋值
    this.attackNum < 3 ? this.attackNum++ : (this.attackNum = 0);
    this.playAnim(ATTACK_LIST[this.attackNum]);
    console.log(ATTACK_LIST[this.attackNum], "动画");
  }
}
