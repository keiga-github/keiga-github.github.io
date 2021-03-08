let sketch = function(p){
    p.setup = function(){
        p.createCanvas(400, 400);
        p.stroke(255);
        this.a = p.height / 2;

    };
    p.draw = function() {

        p.background(51);
        p.line(0, this.a, p.width, this.a);
        this.a = this.a - 0.5;
        if (this.a < 0) {
            this.a = p.height;
        }
        if (p.mouseIsPressed) {
            p.stroke(255,40,255);
        } else {
            p.stroke(237, 34, 93);
        }
        p.line(p.mouseX - 66, p.mouseY, p.mouseX + 66, p.mouseY);
        p.line(p.mouseX, p.mouseY - 66, p.mouseX, p.mouseY + 66);
        //p.background(0);
        //p.fill(255);
        //p.line(p.mouseX, p.mouseY, p.mouseX , p.mouseY);
        //p.line(p.mouseX - 66, p.mouseY, p.mouseX + 66, p.mouseY);
        //p.line(p.mouseX, p.mouseY - 66, p.mouseX, p.mouseY + 66);
        //drawCrossLine();
    };

   //function drawCrossLine(){
   //   
   //}
};

