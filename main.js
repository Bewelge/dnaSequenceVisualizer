var canvas = document.getElementById("canvas");
var seqDiv = document.getElementById("seqDiv");
var ctx = canvas.getContext("2d")
var width = 0;
var height = 0;
var drawS = 1.1;
var drawAmount = 1;
var toDrawAmount=0;
var wrap=true;
var x,y,i;

function start() {
	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	
	  canvas.width = width;
  	canvas.height = height;

    
    x = width / 2;
    y = height * 0.9;
    i =0;
  	let ebolaSeqArray = ebolaSeq.split("");
  	drawSequence(ebolaSeq);
    
    window.addEventListener("mousewheel",function(e) {
        let change = e.deltaY;
        drawS = Math.min(100,
                  Math.max(0.01,
                    drawS * (1+change/100)));
        ctx.clearRect(0,0,width,height);
        ctx.fillText("zoom:"+Math.floor(1000*drawS)/1000, 20,20);
        toDrawAmount=i;
        i=0;
        drawSequence(ebolaSeqArray)
    })


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
          ctx.fillStyle = "red"
          y -= drawS;
          break
        case "t":
          ctx.fillStyle = "green"
          y += drawS;
          break
        case "g":
          ctx.fillStyle = "blue"
          x += drawS;
          break
        case "c":
          ctx.fillStyle = "yellow"
          x -= drawS;
          break
      }
      if (x > width) {
        if (wrap) {
      	 x -= width;
        }
      }
      if (x < 0) {
        if (wrap) {
      	 x += width;
        }
      }
      if (y < 0) {
        if (wrap) {
      	 y+= height;
        }
      }
      if (y > height) {
        if (wrap) {
      	 y -=height;
        }
      }
      ctx.fillRect(x, y, drawS, drawS);
  }



  window.requestAnimationFrame(function() {
    drawSequence(arr);
  });
}


function tick() {
	window.requestAnimationFrame(tick);
}





