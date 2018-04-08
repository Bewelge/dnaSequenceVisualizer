var canvas = document.getElementById("canvas");
var seqDiv = document.getElementById("seqDiv");
var speedInput = document.getElementById("speedInput");
var wrapInput = document.getElementById("wrapInput");
var drawTypeInput = document.getElementById("drawTypeInput");
var ctx = canvas.getContext("2d")
var width = 0;
var height = 0;
var drawS = 3;
var drawAmount = 1;
var toDrawAmount=0;
var wrap=true;
var wrapAmount=0;
var drawType = "squares";
var x,y,i;
var seqArray=[];

function start() {
	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	
	  canvas.width = width;
  	canvas.height = height;


    loadNew();

    
    window.addEventListener("mousewheel",function(e) {
        let change = e.deltaY;
        drawS = Math.min(100,
                  Math.max(0.01,
                    drawS * (1+change/100)));
       reloadFromSamePoint();
    })


}
function reloadFromSamePoint() {
   x = width / 2;
   y = height * 0.9;
   ctx.clearRect(0,0,width,height);
   ctx.fillText("zoom:"+Math.floor(1000*drawS)/1000, 20,20);
   toDrawAmount=i;
   wrapAmount = 0;
   i=0;
   drawSequence(seqArray)
}
function reloadFromBeginning() {
   x = width / 2;
   y = height * 0.9;
   ctx.clearRect(0,0,width,height);
   ctx.fillText("zoom:"+Math.floor(1000*drawS)/1000, 20,20);
   toDrawAmount=0;
   wrapAmount = 0;
   i=0;
   drawSequence(seqArray)
}
function loadNew() {
  ctx.clearRect(0,0,width,height);
  let newSeq = document.getElementById("seqInput").value;
  newSeq = newSeq.split(" ").join("");
  if (newSeq.length==0) {
    newSeq=ebolaSeq;
  }
  seqArray = newSeq.split("");
  
  reloadFromBeginning();
}
function drawSequence(arr) {
  let tmp = 0;
  
  if (toDrawAmount>0) {
    tmp = toDrawAmount;
    toDrawAmount=0;
  }
  for (let j = 0;j<drawAmount + tmp;j++) {
    i++;
    if (i>arr.length) return 
    
      switch (arr[i]) {
        case "a":
          ctx.fillStyle = "red";
          ctx.strokeStyle = "red"
          y -= drawS;
          break
        case "t":
          ctx.fillStyle = "green";
          ctx.strokeStyle = "green"
          y += drawS;
          break
        case "g":
          ctx.fillStyle = "blue";
          ctx.strokeStyle = "blue"
          x += drawS;
          break
        case "c":
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "yellow"
          x -= drawS;
          break
      }
      ctx.globalAlpha =Math.abs(wrapAmount+1)/8;
      if (x > width) {
        if (wrap) {
          wrapAmount++;
         x -= width;
        }
      }
      if (x < 0) {
        if (wrap) {
          wrapAmount--
         x += width;
        }
      }
      if (y < 0) {
        if (wrap) {
          wrapAmount++;
         y+= height;
        }
      }
      if (y > height) {
        if (wrap) {
          wrapAmount--;
         y -=height;
        }
      }
      if (drawType == "circles") {
        ctx.beginPath();
        ctx.arc(x,y,drawS*0.5,0,Math.PI*2,0);
        ctx.fill();
        ctx.closePath();
      } else if (drawType == "squares") {
        ctx.fillRect(x, y, drawS, drawS);
      } else if (drawType == "lines") {
        ctx.beginPath();
        ctx.moveTo(x,y);
        switch (arr[i]) {
          case "a":
            ctx.lineTo(x,y-drawS)
            
            break
          case "t":
            ctx.lineTo(x,y+drawS)
            
            break
          case "g":
            ctx.lineTo(x+drawS,y)
            
            break
          case "c":
            ctx.lineTo(x-drawS,y)
            
            break
        }
        ctx.closePath();
        ctx.stroke();
      }
       
      
      
  }



  window.requestAnimationFrame(function() {
    drawSequence(arr);
  });
}
function setSpeed() {
  let val = speedInput.value;
  drawAmount=parseInt(val);
  reloadFromSamePoint();
}
function setWrap() {
  console.log(123);
  let val = wrapInput.checked;
  wrap=val;
  reloadFromSamePoint();
}
function setDrawType() {
  let val = drawTypeInput.value;
  console.log(val);
  drawType=val;
  reloadFromSamePoint();
}
function tick() {
	window.requestAnimationFrame(tick);
}





