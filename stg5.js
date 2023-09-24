// キーボード操作が有効かどうかを示すフラグ
var keyboardEnabled = true;

// キーボード操作を一時的に無効にする関数
function disableKeyboard() {
  keyboardEnabled = false;
}

// キーボード操作を再度有効にする関数
function enableKeyboard() {
  keyboardEnabled = true;
}

const answers = document.querySelector(".answers");
const animateOptions = {
  duration: 1400,
  easing: "ease",
  fill: "forwards",
};

// スペースキーが押されたときの処理
// case 0: //タイトル画面で呼び出し
function handleKeyPress(event) {
  if (event.keyCode === 32) {
    // answers要素を右に移動させる アニメーションを設定
    answers.style.transition = "transform 1.4s ease";
    answers.style.transform = "translateX(-100vw)";
  }
}
// case 3:ゲームクリアで呼び出し
// 他のページへ遷移

function pageChange(event) {
  if (event.keyCode === 32) {
    window.location.href = "stg6.html"; // [スペースキー]が押されたら新しいページに遷移
  }
}

//起動時の処理
function setup() {
  canvasSize(1200, 720);
  loadImg(0, "image/bg.png");
  loadImg(1, "image/spaceship.png");
  loadImg(2, "image/missile.png");
  loadImg(3, "image/explode.png");
  //   敵キャラクターの画像を読み込むための処理
  for (var i = 0; i <= 4; i++) loadImg(4 + i, "image/enemy" + i + ".png");
  //   アイテムの画像を読み込むための処理
  for (var i = 0; i <= 2; i++) loadImg(9 + i, "image/item" + i + ".png");
  loadImg(12, "image/laser.png");
  loadImg(13, "image/cooltext2.png");
  //   敵Bossキャラクターの画像を読み込むための処理
  for (var i = 0; i <= 2; i++) loadImg(14 + i, "image/BossEnemy" + i + ".png");
  initSShip();
  initMissile();
  initObject();
  // loadSound(0, "sound/bgm.m4a");
}

//メインループ
// (1)背景画の描画について(1/30ごとに速度1pxで移動)
// (2)自機のキーボードード矢印移動と描画位置について
// setObject(typ, png, x, y, xp, yp)
// typ 0=敵の弾 1=敵機
// png 4=敵の弾 5=敵機1 6=敵機2 7=敵機3 8=障害物
function mainloop() {
  tmr++;
  drawBG(1);
  // idx の値に基づいて、ゲームの状態を判定
  switch (idx) {
    case 0: //タイトル画面
      drawImg(13, 200, 200);
      if (tmr % 40 < 20)
        fText("[スペースキー] 押して解答をスタート", 600, 540, 40, "cyan");

      window.addEventListener("keydown", handleKeyPress);

      if (key[32] > 0 || tapC > 0) {
        initSShip();
        initObject();
        score = 0;
        stage = 1;
        idx = 1;
        tmr = 0;
        // playBgm(0);
      }
      break;

    case 1: //ゲーム中
      setEnemy();
      setItem();
      moveSShip();
      moveMissile();
      moveObject();
      drawEffect();
      // エネルギーバーの背景を描画
      for (i = 0; i < 10; i++) fRect(20 + i * 30, 660, 20, 40, "#c00000");
      // エネルギーバーを描画
      for (i = 0; i < energy; i++)
        fRect(
          20 + i * 30,
          660,
          20,
          40,
          colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i)
        );
      // ゲームの最初の 4 秒間は、ステージ番号を表示
      if (tmr < 30 * 4) fText("STAGE5(最終)  ", 600, 300, 50, "cyan");
      // ステージクリア時に "STAGE CLEAR" というメッセージが表示
      if (30 * 115 < tmr && tmr < 30 * 118)
        fText("STAGE CLEAR", 600, 300, 50, "cyan");
        // fText("GAME OVER", 600, 300, 50, "red");
      if (tmr > 30 * 120) {
        idx = 3;
      }
      break;

    case 2: //ゲームオーバー
      // tmr が 2 秒未満(ゲームオーバーから2 秒間だけ）5 フレームごとに
      // プレイヤーの自機の周りに爆発エフェクトを表示します。ssX と ssY は自機の座標で、rnd(120)-60 および rnd(80)-40 は乱数を使用して爆発エフェクトを自機の周りにランダムに配置します。最後の引数 9 は、爆発エフェクトの種類を指定しています。
      if (tmr < 30 * 2 && tmr % 5 == 1)
        setEffect(ssX + rnd(120) - 60, ssY + rnd(80) - 40, 9);
      moveMissile();
      moveObject();
      drawEffect();
      // 画面に "GAME OVER" というテキストを表示します。テキストの位置は (600, 300) で、文字のサイズは 50 ピクセルで、テキストの色は赤色 ("red") です。
      fText("GAME OVER", 600, 300, 50, "red");
      // ゲームオーバー画面が表示されてから 5 秒以上経過した場合、idx 変数を 0 に設定してゲームを再びタイトル画面に戻します
      if (tmr > 30 * 5) {
        idx = 0;
        // キーボード操作を無効にする
        disableKeyboard();
        // 3秒後にキーボード操作を再度有効にする
        setTimeout(enableKeyboard, 3000); // 3000ミリ秒（3秒）後に enableKeyboard 関数を呼び出す
        window.addEventListener("keydown", pageChange);
      }

      break;

    case 3: //ゲームクリア
      disableKeyboard();
      fText("CLEAR", 600, 300, 50, "blue");
      fText("終了！", 600, 540, 40, "cyan");
      initSShip();
      initMissile();
      initObject();
      // 3       秒後に
      setTimeout(function () {
        // キーボード操作を再度有効にする
        enableKeyboard();
        // 他のページへ遷移
        window.addEventListener("keydown", pageChange);
      }, 3000);

      break;
  }
  // fText("SCORE " + score, 200, 50, 40, "white");
  // fText("HISCORE " + hisco, 600, 50, 40, "orange");
  fText("『今の気持ち』として正しいのはどれ？", 600, 150, 30, "white");
}

//背景のスクロール
var bgX = 0;
function drawBG(spd) {
  bgX = (bgX + spd) % 1200;
  drawImg(0, -bgX, 0);
  drawImg(0, 1200 - bgX, 0);
  var hy = 580; //地面の地平線のY座標
  var ofsx = bgX % 40; //縦のラインを移動させるオフセット値
  lineW(2);
  for (var i = 1; i <= 30; i++) {
    //縦のライン
    var tx = i * 40 - ofsx;
    var bx = i * 240 - ofsx * 6 - 3000;
    line(tx, hy, bx, 720, "silver");
  }
  for (var i = 1; i < 12; i++) {
    //横のライン
    lineW(1 + int(i / 3));
    line(0, hy, 1200, hy, "gray");
    hy = hy + i * 2;
  }
}

//ゲームの進行を管理する変数
var idx = 0;
var tmr = 0;

var score = 0; //スコア
var hisco = 0; //ハイスコア
var stage = 0; //ステージ数

//自機の管理
var ssX = 0;
var ssY = 0;
var automa = 0; //弾の自動発射
var enemgy = 0; //エネルギー
var muteki = 0; //無敵状態,無敵状態になっている時間
var weapon = 0; //武器のパワーアップ
var laser = 0; //レーザーの使用回数

function initSShip() {
  ssX = 400;
  ssY = 360;
  energy = 10;
  muteki = 0;
  weapon = 0;
  laser = 0;
}

function moveSShip() {
  if (key[37] > 0 && ssX > 60) ssX -= 20;
  if (key[39] > 0 && ssX < 1000) ssX += 20;
  if (key[38] > 0 && ssY > 40) ssY -= 20;
  if (key[40] > 0 && ssY < 680) ssY += 20;

  //   自動ミサイル（または手動ミサイル）の制御、武器の設定、表示関連の処理、および一時的な無敵状態の処理を行う一連のスクリプト
  // キー番号 65 はキーボードの A キー。A キーが押された瞬間（key[65] の値が 1 ）
  if (key[65] == 1) {
    // "A" キー再度押した場合にこの条件が再度成立しないように
    key[65]++;
    // automa 変数の値を切り替え、automa が0の場合は手動ミサイルモードであり、1の場合は自動ミサイルモードです。
    automa = 1 - automa;
  }
  //キー番号 32 はSpace キーに対応。automa が 0 かつ、Space キーが押された瞬間に実行。
  if (automa == 0 && key[32] == 1) {
    key[32]++;
    // 武器を設定する関数を呼び出し
    setWeapon();
  }
  if (automa == 1 && tmr % 8 == 0)
    // 武器を設定する関数を呼び出し
    setWeapon();
  // col 変数はテキストの色。初期値は "black" 。
  //自動ミサイルモードの場合（automa == 1）、col の値を "white" に設定。
  var col = "black";
  if (automa == 1) col = "white";
  fRect(900, 20, 280, 60, "blue");
  fText("[A]uto Missile", 1040, 50, 36, col);

  if (tapC > 0) {
    //タップ操作
    if (900 < tapX && tapX < 1180 && 20 < tapY && tapY < 80) {
      tapC = 0;
      automa = 1 - automa;
    } else {
      ssX = ssX + int((tapX - ssX) / 6);
      ssY = ssY + int((tapY - ssY) / 6);
    }
  }

  // 自機とのヒットチェックでヒット時muteki = 30;にセットされる
  //   偶数の場合に画像が表示され、奇数の場合に非表示
  if (muteki % 2 == 0) drawImgC(1, ssX, ssY);
  if (muteki > 0) muteki--;
}

function setWeapon() {
  //複数の弾を同時にセットするための関数
  var n = weapon;
  if (n > 8) n = 8;
  for (var i = 0; i <= n; i++)
    setMissile(ssX + 40, ssY - n * 6 + i * 12, 40, int((i - n / 2) * 2));
}

//自機が撃つ弾の管理
// MSL_MAX 最大いくつの弾を撃てるか
// mslX[], mslY[] 弾の(X,Y)座標
// mslXp[], mslYp[] 弾のX軸、Y軸方向の座標の変化量
// mslF[] 弾が撃ちだされた状態か
// mslImg ミサイルの画像を格納するための配列
// mslNum 現在のミサイルの数を示す変数
var MSL_MAX = 100;
var mslX = new Array(MSL_MAX);
var mslY = new Array(MSL_MAX);
var mslXp = new Array(MSL_MAX);
var mslYp = new Array(MSL_MAX);
var mslF = new Array(MSL_MAX);
var mslImg = new Array(MSL_MAX);
var mslNum = 0;

// ミサイルを初期化
// mslF[] 全ての弾を撃ちだされていない状態にセット
function initMissile() {
  for (var i = 0; i < MSL_MAX; i++) mslF[i] = false;
  mslNum = 0;
}

// ミサイルの位置と情報を配列に格納し、設定する
function setMissile(x, y, xp, yp) {
  mslX[mslNum] = x;
  mslY[mslNum] = y;
  mslXp[mslNum] = xp;
  mslYp[mslNum] = yp;
  mslF[mslNum] = true;
  mslImg[mslNum] = 2;
  if (laser > 0) {
    //レーザー
    // プレイヤーがレーザーを1回使用したことが記録
    laser--;
    // レーザーを使用できる状態であれば、ミサイルの画像をレーザー用の画像に切り替え
    mslImg[mslNum] = 12;
  }
  mslNum = (mslNum + 1) % MSL_MAX;
}

// ミサイルの移動と描画について
function moveMissile() {
  for (var i = 0; i < MSL_MAX; i++) {
    if (mslF[i] == true) {
      mslX[i] = mslX[i] + mslXp[i];
      mslY[i] = mslY[i] + mslYp[i];
      drawImgC(mslImg[i], mslX[i], mslY[i]);
      if (mslX[i] > 1200) mslF[i] = false;
    }
  }
}

//物体の管理　敵機、敵の弾、アイテムを管理する
var OBJ_MAX = 100;
var objType = new Array(OBJ_MAX); //0=敵の弾 1=敵機 2=アイテム  配列は物体の種類を格納
var objImg = new Array(OBJ_MAX); //4=敵の弾 5=敵機1 6=敵機2 7=敵機3 8=障害物 9～11アイテム
var objX = new Array(OBJ_MAX);
var objY = new Array(OBJ_MAX);
var objXp = new Array(OBJ_MAX);
var objYp = new Array(OBJ_MAX);
var objLife = new Array(OBJ_MAX);
var objF = new Array(OBJ_MAX);
var objNum = 0;

// 物体（敵機、敵の弾、アイテム）が存在しない状態に初期化するための処理
function initObject() {
  for (var i = 0; i < OBJ_MAX; i++) objF[i] = false;
  objNum = 0;
}

// 物体（敵機、敵の弾、アイテム）の位置と情報を配列に格納し、設定する
function setObject(typ, png, x, y, xp, yp, lif) {
  //0=敵の弾 1=敵機 2=アイテム 配列は物体の種類を格納
  objType[objNum] = typ;
  //4=敵の弾 5=敵機1 6=敵機2 7=敵機3 8=障害物 9～11アイテム 配列は物体の画像を格納
  objImg[objNum] = png;
  objX[objNum] = x;
  objY[objNum] = y;
  objXp[objNum] = xp;
  objYp[objNum] = yp;
  objLife[objNum] = lif;
  objF[objNum] = true;
  objNum = (objNum + 1) % OBJ_MAX;
}

// 物体（敵機、敵の弾、アイテム）を移動し、描画し、特定の条件に基づいて、生成、無効にする処理
function moveObject() {
  for (var i = 0; i < OBJ_MAX; i++) {
    if (objF[i] == true) {
      objX[i] = objX[i] + objXp[i];
      objY[i] = objY[i] + objYp[i];
      if (objImg[i] == 6) {
        //敵2の特殊な動き
        if (objY[i] < 60) objYp[i] = 8;
        if (objY[i] > 660) objYp[i] = -8;
      }
      if (objImg[i] == 7) {
        //敵3の特殊な動き
        if (objXp[i] < 0) {
          objXp[i] = int(objXp[i] * 0.95);
          if (objXp[i] == 0) {
            setObject(0, 4, objX[i], objY[i], -20, 0, 0); //弾を撃つ※重要コード回復アイテム放出
            objXp[i] = 20;
          }
        }
      }
      drawImgC(objImg[i], objX[i], objY[i]); //物体の表示
      //自機が撃った弾とヒットチェック
      // 敵機（objType[i] == 1）とミサイル（mslF[n] == true）の衝突判定
      // rは衝突判定の半径（距離）
      // 物体の幅と高さを合計し、その結果を4で割ります。これにより、物体の幅と高さの平均値が計算されます。平均値に物体の周りに余分なスペースを確保するために12を追加。つまり、物体の周りにある仮想的な円の半径を示しています
      if (objType[i] == 1) {
        //敵機
        var r = 12 + (img[objImg[i]].width + img[objImg[i]].height) / 4; //ヒットチェックの径(距離)

        // 全てのミサイルをチェックするためのループ
        for (var n = 0; n < MSL_MAX; n++) {
          if (mslF[n] == true) {
            // ミサイルと敵機の中心座標との距離が r 未満であるかどうか。つまり、ミサイルが敵機に命中したかどうかを判定しています。
            if (getDis(objX[i], objY[i], mslX[n], mslY[n]) < r) {
              // 通常弾であれば弾を消す
              if (mslImg[n] == 2) mslF[n] = false; //通常弾と貫通弾の違い
              //   敵機の寿命を減少させます。
              objLife[i]--;
              if (objImg[i] == 14) {
                setItemLarge();
              }
              if (objImg[i] == 15) {
                setItemMiddle();
              }
              if (objImg[i] == 16) {
                setEnemyLarge();
              }

              if (objLife[i] == 0) {
                //   敵機の寿命がゼロになった場合、敵機は破壊
                if (objImg[i] == 6 || objImg[i] == 7 || objImg[i] == 8) {
                  objF[i] = false;
                }
                // if (objImg[i] == 14 || objImg[i] == 15) {
                //   energy = 0;
                //   idx = 2;
                //   tmr = 0;
                //   //   stopBgm();
                // }

                // if (objImg[i] == 16) {
                //   idx = 3;
                //   tmr = 0;
                // }

                objF[i] = false;
                score = score + 100;
                if (score > hisco) hisco = score;
                // エフェクトを設定するための関数呼び出し
                setEffect(objX[i], objY[i], 9);
              } else {
                // 寿命がゼロでない場合、敵機はまだ生存しており
                setEffect(objX[i], objY[i], 3);
              }
            }
          }
        }
      }
      //自機とのヒットチェック
      if (idx == 1) {
        //ゲーム中のみ
        var r = 30 + (img[objImg[i]].width + img[objImg[i]].height) / 4; //ヒットチェックの径(距離)
        if (getDis(objX[i], objY[i], ssX, ssY) < r) {
          if (objType[i] <= 1 && muteki == 0) {
            //敵の弾または敵機
            objF[i] = false;
            setEffect(objX[i], objY[i], 9);
            energy--;
            muteki = 30;
            if (energy == 0) {
              //エネルギー0でゲームオーバーへ
              idx = 2;
              //ここでタイマーが0に再設定
              tmr = 0;
              // stopBgm();
            }
          }
          //2=アイテム
          if (objType[i] == 2) {
            //アイテム
            objF[i] = false;
            if (objImg[i] == 9 && energy < 10) energy++;
            if (objImg[i] == 10) weapon++;
            if (objImg[i] == 11) laser = laser + 100;
          }
        }
      }
      //   物体（オブジェクト）の位置が画面外に出た場合に、その物体を無効化
      if (objX[i] < -100 || objX[i] > 1300 || objY[i] < -100 || objY[i] > 820)
        objF[i] = false;
    }
  }
}

//エフェクト（爆発演出）の管理
// EFCT_MAX: 同時に表示できるエフェクトの最大数を表す定数で100 。
// efctN: エフェクトの種類を格納するための配列です。
var EFCT_MAX = 100;
var EFCT_MAX = 100;
var efctX = new Array(EFCT_MAX);
var efctY = new Array(EFCT_MAX);
var efctN = new Array(EFCT_MAX);
var efctNum = 0;

// エフェクトの初期化
function initEffect() {
  for (var i = 0; i < EFCT_MAX; i++) efctN[i] = 0;
  efctNum = 0;
}

// ゲーム内のエフェクトを設定するもの
function setEffect(x, y, n) {
  // efctX　efctY: エフェクトの中心の X 座標　Y 座標
  efctX[efctNum] = x;
  efctY[efctNum] = y;
  efctN[efctNum] = n;
  efctNum = (efctNum + 1) % EFCT_MAX;
}

// ゲーム内のエフェクトを表示 efctN: エフェクトの種類を格納するための配列。
function drawEffect() {
  for (var i = 0; i < EFCT_MAX; i++) {
    if (efctN[i] > 0) {
      drawImgTS(
        3,
        (9 - efctN[i]) * 128,
        0,
        128,
        128,
        efctX[i] - 64,
        efctY[i] - 64,
        128,
        128
      );
      efctN[i]--;
    }
  }
}

function setEnemy() {
  var sec = int(tmr / 30); //経過秒数
  if (4 <= sec && sec < 10) {
    if (tmr % 20 == 0) setObject(1, 5, 1300, 60 + rnd(600), -16, 0, 1 * stage); //敵機1
  }

  if (tmr % 150 == 0) {
    setObject(1, 14, 1300, 0 + rnd(200), -1, 0, 20); // 4秒後に敵機14を出現させる
  }
  if (tmr % 150 == 0) {
    setObject(1, 15, 1300, 200 + rnd(200), -1, 0, 20); // 5秒後に敵機15を出現させる
  }
  if (tmr % 150 == 0) {
    setObject(1, 16, 1300, 400 + rnd(200), -1, 0, 20); // 6秒後に敵機16を出現させる
  }

  if (14 <= sec && sec < 20) {
    if (tmr % 20 == 0) setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3 * stage); //敵機2
  }
  if (24 <= sec && sec < 30) {
    if (tmr % 20 == 0)
      setObject(1, 7, 1300, 360 + rnd(300), -48, -10, 5 * stage); //敵機3
  }
  if (34 <= sec && sec < 50) {
    if (tmr % 60 == 0) setObject(1, 8, 1300, rnd(720 - 192), -6, 0, 0); //障害物
  }
  if (54 <= sec && sec < 70) {
    if (tmr % 20 == 0) {
      setObject(1, 5, 1300, 60 + rnd(300), -16, 4, 1 * stage); //敵機1
      setObject(1, 5, 1300, 360 + rnd(300), -16, -4, 1 * stage); //敵機1
    }
  }
  if (74 <= sec && sec < 90) {
    if (tmr % 20 == 0) setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3 * stage); //敵機2
    if (tmr % 45 == 0) setObject(1, 8, 1300, rnd(720 - 192), -8, 0, 0); //障害物
  }
  if (94 <= sec && sec < 110) {
    if (tmr % 10 == 0) setObject(1, 5, 1300, 360, -24, rnd(11) - 5, 1 * stage); //敵機1
    if (tmr % 20 == 0)
      setObject(1, 7, 1300, rnd(300), -56, 4 + rnd(12), 5 * stage); //敵機3
  }
}

function setEnemyLarge() {
  setObject(1, 5, 1300, 60 + rnd(600), -16, 0, 1 * stage); //敵機1
  setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3 * stage); //敵機2
  setObject(1, 7, 1300, 360 + rnd(300), -48, -10, 5 * stage); //敵機3
}

//アイテムをセットする
function setItem() {
  if (tmr % 900 == 0) setObject(2, 9, 1300, 60 + rnd(600), -10, 0, 0); // Energy
  if (tmr % 900 == 300) setObject(2, 10, 1300, 60 + rnd(600), -10, 0, 0); // Missile
  if (tmr % 900 == 600) setObject(2, 11, 1300, 60 + rnd(600), -10, 0, 0); // Laser
}

//アイテムを中量セットする
function setItemMiddle() {
  setObject(2, 9, 1300, 60 + rnd(600), -10, 0, 0); // Energy
  // setObject(2, 10, 1300, 60 + rnd(600), -10, 0, 0); // Missile
  setObject(2, 11, 1300, 60 + rnd(600), -10, 0, 0); // Laser
}
//アイテムを大量セットする
function setItemLarge() {
  setObject(2, 9, 1300, 60 + rnd(600), -10, 0, 0); // Energy
  // setObject(2, 10, 1300, 60 + rnd(600), -10, 0, 0); // Missile
  setObject(2, 11, 1300, 60 + rnd(600), -10, 0, 0); // Laser      

  setObject(2, 9, 1300, 60 + rnd(600), -10, 0, 0); // Energy
  // setObject(2, 10, 1300, 60 + rnd(600), -10, 0, 0); // Missile
  setObject(2, 11, 1300, 60 + rnd(600), -10, 0, 0); // Laser       
}
