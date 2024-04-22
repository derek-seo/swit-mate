import { Pipe, PipeTransform } from '@angular/core';
import { APP_INFO } from '../../../env';

@Pipe({
  standalone: true,
  name: 'switFileApiDomain',
})
export class SwitFileApiDomainPipe implements PipeTransform {
  transform(value: string): any {
    return `${APP_INFO.fileApiUrl}${value}`;
  }
}
