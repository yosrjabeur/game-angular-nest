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
  @Input() frontcolor = '';
  @Input() backcolor = '';
  @Input() initialValue = 0;
  @Input() vitesse = 0;
  @Input() orientation: Orientation = Orientation.horizontal;
  @Input() auto = false;
  @Input() run = false;

  @ViewChild('canvasRef') canvasRef: ElementRef | undefined;
  animationRef = { value: 0 };

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.resetCanvas();
      if (this.run) {
        this.restartAnim();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('run')) {
      if (this.run) {
        this.restartAnim();
      } else if (this.animationRef.value !== 0) {
        cancelAnimationFrame(this.animationRef.value);
        this.animationRef.value = 0;
        this.resetCanvas();
      }
    }
    if ((changes.hasOwnProperty('initialValue') || 
         changes.hasOwnProperty('vitesse')) && this.run) {
      this.restartAnim();
    }
  }

  resetCanvas() {
    if (this.canvasRef) {
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const width = this.canvasRef.nativeElement.width;
        const height = this.canvasRef.nativeElement.height;
        // Force clear the entire canvas
        ctx.clearRect(0, 0, width, height);
        
        // For horizontal orientation, make sure no rectangle is drawn
        if (this.orientation === Orientation.horizontal) {
          ctx.fillStyle = this.backcolor || '#FFFFFF';
          ctx.fillRect(0, 0, 0, height); // Draw nothing for progress
        } else {
          // For vertical orientation
          ctx.fillStyle = this.backcolor || '#FFFFFF';
          ctx.fillRect(0, height, width, 0); // Draw nothing for progress
        }
      }
    }
  }

  restartAnim() {
    if (this.animationRef.value !== 0) { 
      cancelAnimationFrame(this.animationRef.value); 
      this.animationRef.value = 0;
    }
    if (this.vitesse > 0 && this.run) {
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
    if (this.animationRef.value !== 0) { 
      cancelAnimationFrame(this.animationRef.value);
      this.animationRef.value = 0; 
    }
  }

  animate(canvasRef: ElementRef, initialValue: number, orientation: Orientation, vitesse: number,
          animationRef: { value: number }, auto: boolean, frontcolor: string, backcolor: string) {
    let dateRef: number | undefined;
    const ctx = canvasRef.nativeElement.getContext('2d');
    let widthRef = 0;
    let reflength = canvasRef.nativeElement.width;
    if (orientation === Orientation.vertical) { 
      reflength = canvasRef.nativeElement.height; 
    }
    this.resetCanvas();
    animationRef.value = requestAnimationFrame(draw);

    function fill() {
      if (!ctx || widthRef === undefined) { return; }
      const width = canvasRef.nativeElement.width;
      const height = canvasRef.nativeElement.height;
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
      if (widthRef > reflength) widthRef = reflength;
      fill();
    }

    function draw(timestamp: number) {
      if (dateRef === undefined) { 
        dateRef = timestamp - (initialValue * vitesse / 100); 
      }
      if (!canvasRef) { return; }
      if (widthRef < reflength) {
        renderFrame(timestamp);
        animationRef.value = requestAnimationFrame(draw);
      } else {
        if (auto) {
          reset();
          dateRef = timestamp;
          animationRef.value = requestAnimationFrame(draw);
        } else {
          animationRef.value = 0;
        }
      }
    }

    function reset() {
      if (!ctx) { return; }
      const width = canvasRef.nativeElement.width;
      const height = canvasRef.nativeElement.height;
      ctx.clearRect(0, 0, width, height);
      widthRef = 0;
    }
  }
}
