var canvas = document.getElementById("canvas");
var seqDiv = document.getElementById("seqDiv");
var speedInput = document.getElementById("speedInput");
var wrapInput = document.getElementById("wrapInput");
var drawTypeInput = document.getElementById("drawTypeInput");
var ctx = canvas.getContext("2d")
var width = 0;
var height = 0;
var drawS = 20;
var drawAmount = 1;
var toDrawAmount = 0;
var wrap = false;
var wrapAmount = 0;
var drawType = "squares";
var x, y, z, i;
var seqArray = [];
var staticDirections = false;
var dir = 0;
var zDir = 1;
var is3d = true;
var autoResize = true;

var lastX,lastY;

function start() {
  width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
  height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
  width *= 0.8;
  canvas.width = width;
  canvas.height = height;


  loadNew();


  window.addEventListener("mousewheel", function(e) {
    let change = 1 + e.wheelDeltaY / 500;
    drawS *= change;
    autoResize = false;
    document.getElementById("autoResizeInput").checked = false;
    drawS = Math.min(100,
      Math.max(0.001,
        drawS));
    reloadFromSamePoint();
  })


}

function reloadFromSamePoint() {
  x = lastX = width / 2;
  y = lastY = height * 0.5;
  z = 1;
  ctx.clearRect(0, 0, width, height);
  ctx.fillText("zoom:" + Math.floor(1000 * drawS) / 1000, 20, 20);
  toDrawAmount = i;
  wrapAmount = 0;
  dir = 0;
  i = 0;
  drawSequence(seqArray)
}

function reloadFromBeginning() {
  x = lastX = width / 2;
  y = lastY = height * 0.5;
  drawS = 20;
  z = 1;
  ctx.clearRect(0, 0, width, height);
  ctx.fillText("zoom:" + Math.floor(1000 * drawS) / 1000, 20, 20);
  toDrawAmount = 0;
  wrapAmount = 0;
  dir = 0;
  i = 0;
  drawSequence(seqArray)
}

function loadNew() {
  ctx.clearRect(0, 0, width, height);
  let newSeq = document.getElementById("seqInput").value;
  newSeq = newSeq.split(" ").join("");
  if (newSeq.length == 0) {
    newSeq = ebolaSeq;
  }
  seqArray = newSeq.split("");

  reloadFromBeginning();
}

function drawSequence(arr) {
  let tmp = 0;

  if (toDrawAmount > 0) {
    tmp = toDrawAmount;
    toDrawAmount = 0;
  }

  for (let j = 0; j < drawAmount + tmp; j++) {
    i++;
    let tmpDrawS = drawS * (1 - i / arr.length);
    let tmpZ = 1 + z;
    if (!is3d) tmpZ = 1;

    if (i > arr.length) return

    setColor(arr[i]);
    setPositions(arr[i], tmpDrawS);



    wrapPositions()

    if (tmpZ*tmpDrawS > width*0.25) {
      continue;
    }

    if (drawType == "circles") {
      ctx.beginPath();
      ctx.arc(x, y, tmpZ * tmpDrawS * 0.5, 0, Math.PI * 2, 0);
      ctx.fill();
      ctx.closePath();
    } else if (drawType == "squares") {
      ctx.fillRect(x, y, tmpDrawS * tmpZ, tmpDrawS * tmpZ);
    } else if (drawType == "lines") {
      ctx.lineWidth = tmpDrawS*tmpZ;
      ctx.beginPath();
      try {

        ctx.moveTo(lastX, lastY);
      }catch(e) {
        ctx.moveTo(x, y);
        
      }

      switch (arr[i]) {
        case "a":
          ctx.lineTo(x, y )

          break
        case "t":
          ctx.lineTo(x, y )

          break
        case "g":
          ctx.lineTo(x , y)

          break
        case "c":
          ctx.lineTo(x , y)

          break
        case "n":
          ctx.lineTo(x , y)

          break
      }
      ctx.closePath();
      ctx.stroke();
      lastX = x;
      lastY = y;
    }
  }
  window.requestAnimationFrame(function() {
    drawSequence(arr);
  });
}

function setColor(genome) {
  switch (genome) {
    case "a":
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      break
    case "t":
      ctx.fillStyle = "green";
      ctx.strokeStyle = "green";
      break
    case "g":
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      break
    case "c":
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "yellow";
      break
     case "n":
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      break
  }
}

function setPositions(genome, tmpDrawS) {
  let tmpZ = 1;
  if (is3d) {
    tmpZ = z;
  } 
  switch (genome) {
    case "a":
      if (staticDirections) {
        y -= tmpZ * tmpDrawS;
      } else {
        dir += Math.PI / 10
        x += (tmpZ) * tmpDrawS * Math.cos(dir);
        y += (tmpZ) * tmpDrawS * Math.sin(dir);
      }
      break
    case "t":
      if (staticDirections) {
        y += tmpZ * tmpDrawS;
      } else {
        dir -= Math.PI / 10
        x += (tmpZ) * tmpDrawS * Math.cos(dir);
        y += (tmpZ) * tmpDrawS * Math.sin(dir);
      }
      break
    case "g":
      if (staticDirections) {
        x += tmpZ * tmpDrawS;
      } else {
        dir += Math.PI / 5
        x += tmpZ * tmpDrawS * Math.cos(dir);
        y += tmpZ * tmpDrawS * Math.sin(dir);
      }
      if (is3d) {
        zDir -= Math.PI / 100;
      }
      break
    case "c":
      if (staticDirections) {
        x -= tmpZ * tmpDrawS;
      } else {
        dir -= Math.PI / 5
        x += tmpZ * tmpDrawS * Math.cos(dir);
        y += tmpZ * tmpDrawS * Math.sin(dir);
      }
      if (is3d) {
        zDir += Math.PI / 100;
      }
      break
    case "n":
      

      break
  }
  z *= (zDir);
  zDir = 1;

}

function wrapPositions() {
  if (x + drawS > width) {
    wrapAmount++;
    if (wrap) {
      x -= width;
      reloadFromSamePoint();
    } else if (autoResize) {

      drawS *= 0.9;
      reloadFromSamePoint();
    }
  }
  if (x - drawS < 0) {
    wrapAmount--
    if (wrap) {
      x += width;
      reloadFromSamePoint();
    } else if (autoResize) {

      drawS *= 0.9;
      reloadFromSamePoint();
    }
  }
  if (y - drawS < 0) {
    wrapAmount++;
    if (wrap) {
      y += height;
      reloadFromSamePoint();
    } else if (autoResize) {

      drawS *= 0.9;
      reloadFromSamePoint();
    }
  }
  if (y + drawS > height) {
    wrapAmount--;
    if (wrap) {
      y -= height;
      reloadFromSamePoint();
    } else if (autoResize) {

      drawS *= 0.9;
      reloadFromSamePoint();
    }
  }
}

function setStatic() {
  staticDirections = true;

  document.getElementById("staticInput").checked = true;
  document.getElementById("fluentInput").checked = false;

  reloadFromSamePoint();
}

function setFluent() {
  document.getElementById("fluentInput").checked = true;
  staticDirections = false;

  document.getElementById("staticInput").checked = false;

  reloadFromSamePoint();
}

function set3d() {
  staticDirections = false;
  let val = document.getElementById("3dInput").checked;
  is3d = val;
  reloadFromSamePoint();
}

function setSpeed() {
  let val = speedInput.value;
  drawAmount = parseInt(val);
  reloadFromSamePoint();
}

function setAutoResize() {
  let val = document.getElementById("autoResizeInput").checked;
  if (val) {
    wrap = false;
    wrapInput.checked = false;
  }
  autoResize = val;
}

function setZoom() {
  let val = zoomInput.value;
  drawS = parseInt(val);
  document.getElementById("autoResizeInput").checked = false;
  autoResize = false;
  reloadFromSamePoint();
}

function setWrap() {
  let val = wrapInput.checked;
  if (val) {
    document.getElementById("autoResizeInput").checked = false;
    autoResize = false;

  }
  wrap = val;
  reloadFromSamePoint();
}

function setDrawType() {
  let val = drawTypeInput.value;
  console.log(val);
  drawType = val;
  reloadFromSamePoint();
}

function tick() {
  window.requestAnimationFrame(tick);
}