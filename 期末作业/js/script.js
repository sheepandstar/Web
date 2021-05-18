let status = "waiting";//状态
let lastTimestamp;//上次时间戳
let santaX;
let santaY;
let sceneOffset;//场景偏移
let score = 0;//得分
let platforms = [];//平台
let sticks = [];//棍枝
let trees = [];//树
let clouds = [];//云
let maxgrade = 0;//最高分

var xmlHttp;


const config = {//配置对象
  canvasWidth: 375,//画布宽度
  canvasHeight: 375,//画布高度
  platformHeight: 100,//平台高度
  santaDistanceFromEdge: 10,//圣诞老人与边缘的距离
  paddingX: 100,
  perfectAreaSize: 10,//完美大小
  backgroundSpeedMultiplier: 0.2,//背景速度倍增器
  speed: 4,//速度
  santaWidth: 17,//圣诞老人宽度
  santaHeight: 30//圣诞老人高度
};

const colours = {//颜色对象
  lightBg: "#62AFB9",
  medBg: "#182757",
  darkBg: "#0D5B66",
  lightHill: "#E9E9E9",
  medHill: "#34A65F",
  darkHill: "#07133A",
  platform: "#9B4546",
  platformTop: "#620E0E",
  em: "#CC231E",
  skin: "#CF6D60"
};

const hills = [//高度颜色不同的山数组
  {
    baseHeight: 120,
    amplitude: 20,
    stretch: 0.5,
    colour: colours.lightHill
  },
  {
    baseHeight: 100,
    amplitude: 10,
    stretch: 1,
    colour: colours.medHill
  },
  {
    baseHeight: 70,
    amplitude: 20,
    stretch: 0.5,
    colour: colours.darkHill
  }
];

const max_scoreElement = createElementStyle(//设置最高分样式
  "div",
  `position:absolute;color:yellow;top:0.5em;left:0.5em;font-size:2em;font-weight:300;text-shadow:${addShadow(
    colours.darkHill,
    7
  )}`
);
var result =  GetRequest();//获得截取url之后的参数
maxgrade = decodeURI(result[1][1]);//获取历史最高分
var username = decodeURI(result[0][1]);//获取用户名
max_scoreElement.innerHTML = username +",最高纪录："+maxgrade;//写入数据

//设置分数元素样式
const scoreElement = createElementStyle(
  "div",
  `position:absolute;top:1.5em;font-size:5em;font-weight:900;text-shadow:${addShadow(
    colours.darkHill,
    7
  )}`
);

const canvas = createElementStyle("canvas");//添加画布元素
const introductionElement = createElementStyle(//介绍要素元素
  "div",
  `font-size:1.2em;position:absolute;text-align:center;transition:opacity 2s;width:250px`,
  "Press and hold anywhere to stretch out a sugar cane, it has to be the exact length or Santa will fall down"
);


const perfectElement = createElementStyle(//台阶中部完美部分
  "div",
  "position:absolute;opacity:0;transition:opacity 2s",
  "Double Score"
);

//设置重新开始按钮样式
const restartButton = createElementStyle(
  "button",
  `width:120px;height:120px;position:absolute;border-radius:50%;color:white;background-color:${colours.em};border:none;font-weight:700;font-size:1.2em;display:none;cursor:pointer`,
  "RESTART"
);

//设置雪花样式
for (let i = 0; i <= 30; i++) {
  createElementStyle(
    "i",
    `font-size: ${3 * Math.random()}em;left: ${
      100 * Math.random()
    }%; animation-delay: ${10 * Math.random()}s, ${2 * Math.random()}s`,
    "."
  );
}

//设置画布宽度和高度
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

Array.prototype.last = function () {
  return this[this.length - 1];
};

Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

window.addEventListener("keydown", function (event) {//窗口添加键盘按下事件
  if (event.key == " ") {//按下空格键
    event.preventDefault();
    resetGame();//重置游戏
    return;
  }
});

["mousedown", "touchstart"].forEach(function (evt) {//鼠标左键按下事件
  window.addEventListener(evt, function (event) {
    if (status == "waiting") {//等待状态
      lastTimestamp = undefined;//上次时间戳
      introductionElement.style.opacity = 0;
      status = "stretching";//拉伸状态
      window.requestAnimationFrame(animate);//动画
    }
  });
});

["mouseup", "touchend"].forEach(function (evt) {//鼠标左键弹起
  window.addEventListener(evt, function (event) {
    if (status == "stretching") {//拉伸状态
      status = "turning";//转弯状态
    }
  });
});

window.addEventListener("resize", function (event) {//浏览器窗口被重置时触发
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();//重绘
});

//给重新开始按钮设置鼠标点击事件
restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();//重置游戏
  restartButton.style.display = "none";//重新开始后按钮消失
});

window.requestAnimationFrame(animate);

resetGame();

//重置游戏
function resetGame() {
  status = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;
  introductionElement.style.opacity = 1;
  perfectElement.style.opacity = 0;
  restartButton.style.display = "none";
  scoreElement.innerText = score;
  platforms = [{ x: 50, w: 50 }];
  santaX = platforms[0].x + platforms[0].w - config.santaDistanceFromEdge;
  santaY = 0;
  sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
  trees = [];
  clouds = [];

  max_scoreElement.innerHTML = username +",最高纪录："+maxgrade;
  console.log(max_scoreElement.innerHTML);
 // max_scoreElement.innerHTML = "最高纪录："+maxgrade;

  for (let i = 0; i <= 20; i++) {
    if (i <= 3) generatePlatform();//生成平台、树、云
    generateTree();
    generateCloud();
  }

  draw();
}

//生成云
function generateCloud() {
  const minimumGap = 60;
  const maximumGap = 300;

  const lastCloud = clouds[clouds.length - 1];
  let furthestX = lastCloud ? lastCloud.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  const y =
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap)) -
    window.innerHeight / 1.2;

  const w = Math.floor(Math.random() * 15 + 15);
  clouds.push({ x, y, w });
}

//生成树
function generateTree() {
  const minimumGap = 30;
  const maximumGap = 150;

  const lastTree = trees[trees.length - 1];
  let furthestX = lastTree ? lastTree.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  const treeColors = [colours.lightHill, colours.medBg, colours.medHill];
  const color = treeColors[Math.floor(Math.random() * 3)];

  trees.push({ x, color });
}

//生成平台
function generatePlatform() {
  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  platforms.push({ x, w });
}

//动画
function animate(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  switch (status) {
    case "waiting"://等待状态
      return;
    case "stretching": {//拉伸状态
      sticks.last().length += (timestamp - lastTimestamp) / config.speed;
      break;
    }
    case "turning": {//转向状态，主要用于判断木棍落下的位置，以此计分
      sticks.last().rotation += (timestamp - lastTimestamp) / config.speed;

      if (sticks.last().rotation > 90) {
        sticks.last().rotation = 90;

        const [nextPlatform, perfectHit] = thePlatformTheStickHits();
        if (nextPlatform) {//下一个平台积一分
          score += perfectHit ? 2 : 1;
          scoreElement.innerText = score;

          if (perfectHit) {//完美部分，积两分
            perfectElement.style.opacity = 1;
            setTimeout(() => (perfectElement.style.opacity = 0), 1000);
          }

          generatePlatform();
          generateTree();
          generateTree();

          generateCloud();
          generateCloud();
        }

        status = "walking";//前进
      }
      break;
    }
    case "walking": {//前进
      santaX += (timestamp - lastTimestamp) / config.speed;

      const [nextPlatform] = thePlatformTheStickHits();
      if (nextPlatform) {
        const maxSantaX =
          nextPlatform.x + nextPlatform.w - config.santaDistanceFromEdge;
        if (santaX > maxSantaX) {
          santaX = maxSantaX;
          status = "transitioning";//过渡
        }
      } else {
        const maxSantaX =
          sticks.last().x + sticks.last().length + config.santaWidth;
        if (santaX > maxSantaX) {
          santaX = maxSantaX;
          status = "falling";//坠落
        }
      }
      break;
    }
    case "transitioning": {//过渡
      sceneOffset += (timestamp - lastTimestamp) / (config.speed / 2);

      const [nextPlatform] = thePlatformTheStickHits();
      if (sceneOffset > nextPlatform.x + nextPlatform.w - config.paddingX) {
        sticks.push({
          x: nextPlatform.x + nextPlatform.w,
          length: 0,
          rotation: 0
        });
        status = "waiting";//等待状态
      }
      break;
    }
    case "falling": {//坠落
      if (sticks.last().rotation < 180)
        sticks.last().rotation += (timestamp - lastTimestamp) / config.speed;

      santaY += (timestamp - lastTimestamp) / (config.speed / 2);
      const maxSantaY =
        config.platformHeight +
        100 +
        (window.innerHeight - config.canvasHeight) / 2;
      if (santaY > maxSantaY) {
        restartButton.style.display = "block";//显示重新开始按钮

      if(score > maxgrade)//更新最高分
        maxgrade = score;
        
      //写回最高分
      var result =  GetRequest();
      xmlHttp=GetXmlHttpObject();
      if (xmlHttp==null)
      {
        alert ("Browser does not support HTTP Request");
        return;
      } 
      var url="php/Grade.php";
      url=url+"?score="+score;
      url=url+"&username="+username;
      xmlHttp.open("GET",url,true);
      xmlHttp.send(null);
      
        return;
      }
      break;
    }
    default:
      throw Error("Wrong status");
  }

  draw();
  window.requestAnimationFrame(animate);

  lastTimestamp = timestamp;
}


function GetRequest() {
  var url = window.location.search; //获取url中"?"符后的字串
  if (url.indexOf("?") != -1) {  //判断是否有参数
      var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
      strs = str.split("&"); //用等号进行分隔（因为知道只有一个参数所以直接用等号进分隔如果有多个参数要用&号分隔再用等号进行分隔）
      var result={};
      var i;
      for(i=0;i<strs.length;i++)
      {
        result[i] = strs[i].split("=");
      }
      //return decodeURI(strs[1]);     //直接弹出第一个参数 （如果有多个参数 还要进行循环的） 解码
      return result;
  }
}

//平台上的木棍
function thePlatformTheStickHits() {
  if (sticks.last().rotation != 90)
    throw Error(`Stick is ${sticks.last().rotation}°`);
  const stickFarX = sticks.last().x + sticks.last().length;

  const platformTheStickHits = platforms.find(
    (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
  );

  if (
    platformTheStickHits &&
    platformTheStickHits.x +
      platformTheStickHits.w / 2 -
      config.perfectAreaSize / 2 <
      stickFarX &&
    stickFarX <
      platformTheStickHits.x +
        platformTheStickHits.w / 2 +
        config.perfectAreaSize / 2
  )
    return [platformTheStickHits, true];

  return [platformTheStickHits, false];
}

//绘制
function draw() {
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawBackground();
  ctx.translate(
    (window.innerWidth - config.canvasWidth) / 2 - sceneOffset,
    (window.innerHeight - config.canvasHeight) / 2
  );

  drawPlatforms();
  drawSanta();
  drawSticks();

  ctx.restore();
}

//绘制平台
function drawPlatforms() {
  platforms.forEach(({ x, w }) => {
    let newX = x + 3;
    let newW = w - 6;
    let platformHeight =
      config.platformHeight + (window.innerHeight - config.canvasHeight) / 2;
    ctx.fillStyle = colours.platform;
    ctx.fillRect(
      newX,
      config.canvasHeight - config.platformHeight,
      newW,
      platformHeight
    );

    for (let i = 1; i <= platformHeight / 10; ++i) {
      let yGap = config.canvasHeight - config.platformHeight + i * 10;
      ctx.moveTo(newX, yGap);
      ctx.lineTo(newX + newW, yGap);
      let xGap = i % 2 ? 0 : 10;
      for (let j = 1; j < newW / 30; ++j) {
        let x = j * 20 + xGap;
        ctx.moveTo(newX + x, yGap);
        ctx.lineTo(newX + x, yGap + 10);
      }
      ctx.strokeStyle = colours.platformTop;
      ctx.stroke();
    }

    ctx.fillStyle = colours.platformTop;
    ctx.fillRect(x, config.canvasHeight - config.platformHeight, w, 10);

    if (sticks.last().x < x) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        x + w / 2 - config.perfectAreaSize / 2,
        config.canvasHeight - config.platformHeight,
        config.perfectAreaSize,
        config.perfectAreaSize
      );
    }
  });
}

//绘制圣诞老人
function drawSanta() {
  ctx.save();
  ctx.fillStyle = "red";
  ctx.translate(
    santaX - config.santaWidth / 2,
    santaY +
      config.canvasHeight -
      config.platformHeight -
      config.santaHeight / 2
  );

  ctx.fillRect(
    -config.santaWidth / 2,
    -config.santaHeight / 2,
    config.santaWidth,
    config.santaHeight - 4
  );

  const legDistance = 5;
  ctx.beginPath();
  ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = colours.skin;
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();
  
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(7, -2, 3, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.moveTo(-8, -13.5);
  ctx.lineTo(-15, -3.5);
  ctx.lineTo(-5, -7);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.fillRect(-config.santaWidth / 2, -12, config.santaWidth, 3);

  ctx.fillStyle = "black";
  ctx.fillRect(-config.santaWidth / 2, 2, config.santaWidth, 2);
  ctx.fillStyle = "white";
  ctx.fillRect(-config.santaWidth / 2, 4, config.santaWidth, 4.5);

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(-17, -2, 3, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.restore();
}

//绘制木棍
function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    ctx.translate(stick.x, config.canvasHeight - config.platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);

    ctx.strokeStyle = ctx.createPattern(createCandyPattern(), "repeat");
    ctx.stroke();

    ctx.restore();
  });
}

//绘制背景
function drawBackground() {
  var gradient = ctx.createRadialGradient(
    window.innerWidth / 2,
    window.innerHeight / 2,
    0,
    window.innerHeight / 2,
    window.innerWidth / 2,
    window.innerWidth
  );
  gradient.addColorStop(0, colours.lightBg);
  gradient.addColorStop(1, colours.darkBg);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  hills.forEach((hill) =>
    drawHill(hill.baseHeight, hill.amplitude, hill.stretch, hill.colour)
  );
  trees.forEach((tree) => drawTree(tree.x, tree.color));
  clouds.forEach((cloud) => drawCloud(cloud.x, cloud.y, cloud.w));
}

//绘制山
function drawHill(baseHeight, amplitude, stretch, color) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
  for (let i = 0; i < window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
  }
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.fillStyle = color;
  ctx.fill();
}

//绘制树
function drawTree(x, color) {
  ctx.save();
  ctx.translate(
    (-sceneOffset * config.backgroundSpeedMultiplier + x) * hills[1].stretch,
    getTreeY(x, hills[1].baseHeight, hills[1].amplitude)
  );

  const treeTrunkHeight = 15;
  const treeTrunkWidth = 10;
  const treeCrownHeight = 60;
  const treeCrownWidth = 30;

  // Draw trunk
  ctx.fillStyle = colours.darkHill;
  ctx.fillRect(
    -treeTrunkWidth / 2,
    -treeTrunkHeight,
    treeTrunkWidth,
    treeTrunkHeight
  );

  // Draw crown
  ctx.beginPath();

  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight * 3);
  ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight * 3);

  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight * 2);
  ctx.lineTo(0, -(treeTrunkHeight / 2 + treeCrownHeight));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight * 2);

  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
  ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight / 2));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

//绘制云
function drawCloud(x, y, width) {
  ctx.save();
  ctx.translate(
    (-sceneOffset * config.backgroundSpeedMultiplier + x) * hills[1].stretch,
    getTreeY(x, hills[1].baseHeight, hills[1].amplitude)
  );

  height = width * 1.5;
  ctx.beginPath();
  ctx.arc(x, y, width, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x + height, y - width, height, Math.PI * 1, Math.PI * 2);
  ctx.arc(x + height * 2, y - width, height, Math.PI * 1.2, Math.PI);
  ctx.arc(x + width * 3, y, width, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(x + width * 3, y + width);
  ctx.lineTo(x, y + width);
  ctx.fillStyle = "rgba(255, 255, 255, .3)";
  ctx.fill();

  ctx.restore();
}

//创建糖果图案
function createCandyPattern() {
  const patternCanvas = document.createElement("canvas");
  const pctx = patternCanvas.getContext("2d");

  const max = 15;
  let i = 0;
  let x = 0;
  let z = 90;

  while (i < max) {
    pctx.beginPath();
    pctx.moveTo(0, x);
    pctx.lineTo(0, z);
    pctx.lineWidth = 24;
    pctx.strokeStyle = "red";
    pctx.stroke();

    pctx.beginPath();
    pctx.moveTo(0, x + 24);
    pctx.lineTo(0, z + 24);
    pctx.lineWidth = 24;
    pctx.strokeStyle = "white";
    pctx.stroke();

    x += 48;
    z += 48;
    i++;
  }

  return patternCanvas;
}

//获取山的高度
function getHillY(windowX, baseHeight, amplitude, stretch) {
  const sineBaseY = window.innerHeight - baseHeight;
  return (
    Math.sinus(
      (sceneOffset * config.backgroundSpeedMultiplier + windowX) * stretch
    ) *
      amplitude +
    sineBaseY
  );
}

//获取树的高度
function getTreeY(x, baseHeight, amplitude) {
  const sineBaseY = window.innerHeight - baseHeight;
  return Math.sinus(x) * amplitude + sineBaseY;
}

//创建元素样式
function createElementStyle(element, cssStyles = null, inner = null) {
  const g = document.createElement(element);
  if (cssStyles) g.style.cssText = cssStyles;
  if (inner) g.innerHTML = inner;
  document.body.appendChild(g);
  return g;
}

//添加阴影
function addShadow(colour, depth) {
  let shadow = "";
  for (let i = 0; i <= depth; i++) {
    shadow += `${i}px ${i}px 0 ${colour}`;
    shadow += i < depth ? ", " : "";
  }
  return shadow;
}

//GetXmlHttpObject
function GetXmlHttpObject()
{
var xmlHttp=null;
try
 {
 // Firefox, Opera 8.0+, Safari
 xmlHttp=new XMLHttpRequest();
 }
catch (e)
 {
 // Internet Explorer
 try
  {
  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
  }
 catch (e)
  {
  xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
 }
return xmlHttp;
}
