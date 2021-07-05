import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'heroStarLabel'
})
export class HeroStarLabelPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  transform([rank, ascended]: [number | undefined, number | undefined]): SafeHtml {
    const ascendedStars = '&#9733;'.repeat(ascended ?? 0);
    const normalStars = '&#9734;'.repeat((rank ?? 0) - (ascended ?? 0));
    return this._sanitizer.sanitize(SecurityContext.HTML, ascendedStars + normalStars) ?? '';
  }

}
