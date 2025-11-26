// contract-print.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EmployeeService , ContractPrintModel} from 'src/app/generated';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contract-print',
  templateUrl: './contract-print.component.html',
  styleUrls: ['./contract-print.component.scss'],
})
export class ContractPrintComponent implements OnInit {
  contract: ContractPrintModel | null = null;
  isLoading = true;
  employeeId: number = 0;
  contractId: number = 0;
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastrService: ToastrService,
    private location: Location
  ) {}

  async ngOnInit() {
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));

    console.log(this.route.snapshot.paramMap)

    await this.loadContractForPrint();
  }

  async loadContractForPrint() {
    this.isLoading = true;
    try {
      this.contract = await firstValueFrom(
        this.employeeService.employeeControllerGetContractForPrint(
          this.contractId,
          0

        )
      );
    } catch (error) {
      this.toastrService.error('Failed to load contract information');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  printContract() {
    window.print();
  }

  goBack() {
    this.location.back();
  }

  getCompanyLogo(): string {
    if (this.contract?.company?.archive?.fileBase64) {
      const contentType = this.contract.company.archive.contentType || 'image/png';
      return `data:${contentType};base64,${this.contract.company.archive.fileBase64}`;
    }
    return '';
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getFullAddress(address: any): string {
    if (!address) return 'N/A';
    const parts = [
      address.quarter,
      address.town,
      address.region,
      address.country
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  }

  getContractDuration(): string {
    if (!this.contract) return '';

    const start = new Date(this.contract.startDate??'');
    const end = this.contract.endDate ? new Date(this.contract.endDate) : null;

    if (!end) {
      return 'Permanent Contract (No End Date)';
    }

    const months = (end.getFullYear() - start.getFullYear()) * 12 +
                   (end.getMonth() - start.getMonth());

    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
    }
  }
}
