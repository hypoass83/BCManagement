// src/app/services/bonus-helper.service.ts
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonusHelperService {

  constructor(private bonusService: BonusService) { }

  async getTotalBonusesForEmployee(
    employeeId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    try {
      const result: any = await firstValueFrom(
        this.bonusService.bonusControllerGetTotalBonusesForEmployee(
          employeeId,
          startDate?.toISOString(),
          endDate?.toISOString()
        )
      );
      return result.total || 0;
    } catch (error) {
      console.error('Error getting total bonuses:', error);
      return 0;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
