import { HttpContextToken } from '@angular/common/http';

export const SKIP_CONFIRM = new HttpContextToken<boolean>(() => false);
