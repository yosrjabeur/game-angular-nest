import { Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
export enum Orientation {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

@Component({
  selector: 'app-progressbar',
  imports: [],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent implements OnChanges, OnDestroy {
  @Input()
frontcolor = '';
@Input()
backcolor = '';

@Input()
initialValue = 0;

@Input()
vitesse = 0;

@Input()
orientation: Orientation = Orientation.horizontal;

@Input()
auto = false;

@Input()
run = false;

@ViewChild('canvasRef') canvasRef: ElementRef | undefined;
animationRef = {value: 0};

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.restartAnim()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('initialValue')) {
      this.restartAnim();
    }
    if (changes.hasOwnProperty('vitesse')) {
      this.restartAnim();
    }
    if (changes.hasOwnProperty('run')) {
      this.restartAnim();
    }
  }

restartAnim() {
    if (this.vitesse > 0 && this.run) {
      if (this.animationRef.value !== 0) { cancelAnimationFrame(this.animationRef.value); }
      const ref = this.canvasRef;
      if (ref) {
        this.ngZone.runOutsideAngular(() =>
          this.animate(ref, this.initialValue, this.orientation, this.vitesse,
            this.animationRef, this.auto, this.frontcolor, this.backcolor)
        );
      }
    }
  }

ngOnDestroy() {
    if (this.animationRef.value !== 0) { cancelAnimationFrame(this.animationRef.value); }
  }

animate(canvasRef: ElementRef, initialValue: number, orientation: Orientation, vitesse: number,
        animationRef: { value: number }, auto: boolean, frontcolor: string, backcolor: string) {
    let dateRef: number | undefined;
    const ctx = canvasRef.nativeElement.getContext('2d');
    let widthRef = 0;
    let reflength = canvasRef.nativeElement.width;
    if (orientation === Orientation.vertical) { reflength = canvasRef.nativeElement.height; }

    animationRef.value = requestAnimationFrame(draw);

    function fill() {
      if (!ctx || !widthRef) { return; }
      const width = canvasRef.nativeElement.width;
      const height = canvasRef.nativeElement.height;
    
      //  Nettoie le canvas avant de dessiner la barre
      ctx.clearRect(0, 0, width, height);
    
      ctx.fillStyle = frontcolor || '#008800';
      if (orientation === Orientation.horizontal) {
        ctx.fillRect(0, 0, widthRef, height);
      } else {
        ctx.fillRect(0, height - widthRef, width, height);
      }
    }
    

    function renderFrame(timestamp: number) {
      if (!ctx || !dateRef) { return; }
      const elapsetime = timestamp - dateRef;
      const percent = (elapsetime * 100) / vitesse;
      widthRef = (percent * reflength) / 100;
      if (widthRef < reflength) {
        fill();
      }
    }


    function draw(timestamp: number) {
      if (dateRef === undefined) { dateRef = timestamp - initialValue; }
      if (!canvasRef) { return; }
      if (widthRef < reflength) {
        renderFrame(timestamp);
        animationRef.value = requestAnimationFrame(draw);
      } else {
        reset();
        if (auto) {
          dateRef = timestamp;
          animationRef.value = requestAnimationFrame(draw);
        }
      }
    }

    function reset() {
      if (!ctx) { return; }
      const width = canvasRef.nativeElement.width;
      const height = canvasRef.nativeElement.height;
    
      //  Nettoie complètement le canvas
      ctx.clearRect(0, 0, width, height);
    
      ctx.fillStyle = backcolor || '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      widthRef = 0;
    }
        }


}
