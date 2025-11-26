import { ChangeDetectorRef, effect, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import SecurityModuleService from 'src/app/services/security/module.service';
// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  children2?: Menu[];
  Menusub?: boolean;
  target?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search = false;

  // Language
  public language = false;

  // Mega Menu
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen = false;
  active: any;

  constructor(private router: Router,private moduleService:SecurityModuleService) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }







  MENUITEMS: Menu[] = [
    // Dashboard
    { headTitle: 'MAIN' },
    {
      title: 'Dashboards',
      icon: 'home-8-line',
      type: 'sub',
      selected: false,
      active: false,
      children: [
        { path: '/dashboard/sales', title: 'Sales', type: 'link' },
        { path: '/dashboard/ecommerce', title: 'Ecommerce', type: 'link' },

      ],
    },
    //Widgets
    {
      title: 'Widgets',
      icon: 'apps-2-line',
      active: false,
      badgeClass: 'badge badge-sm bg-secondary badge-hide',
      badgeValue: 'new',
      path: '/widgets',
      selected: false,
      type: 'link',
    },
    //component
    { headTitle: 'GENERAL' },
    {
      title: 'Components',
      icon: 'inbox-line',
      type: 'sub',
      Menusub: true,
      selected : false,
      active: false,
      children: [
        { path: '/components/accordion', title: 'Accordion', type: 'link' },
        { path: '/components/alerts', title: 'Alerts', type: 'link' },
        { path: '/components/avatars', title: 'Avatars', type: 'link' },
        { path: '/components/badges', title: 'Badges', type: 'link' },
        { path: '/components/blackquotes', title: 'Blackquotes', type: 'link' },
        { path: '/components/buttons', title: 'buttons', type: 'link' },
        { path: '/components/cards', title: 'Cards', type: 'link' },
        { path: '/components/collapse', title: 'collapse', type: 'link' },
        { path: '/components/indicators', title: 'indicators', type: 'link' },
        { path: '/components/list', title: 'list', type: 'link' },
        { path: '/components/listgroup', title: 'listgroup', type: 'link' },
        { path: '/components/skeleton', title: 'skeleton', type: 'link' },
        { path: '/components/progress', title: 'progress', type: 'link' },
        { path: '/components/spinners', title: 'spinners', type: 'link' },
        { path: '/components/toast', title: 'toast', type: 'link' },
      ],
    },
    // //Elements
    {
      title: 'Elements',
      icon: 'cpu-line',
      type: 'sub',
      Menusub: true,
      selected : false,
      active: false,
      children: [
        { path: '/elements/nav-bar', title: 'Navbar', type: 'link' },
        { path: '/elements/megamenu', title: 'MegaMenu', type: 'link' },
        { path: '/elements/nav-tabs', title: 'Nav&Tabs', type: 'link' },
        { path: '/elements/scrollspy', title: 'Scrollspy', type: 'link' },
        { path: '/elements/breadcrumb', title: 'Breadcrumb', type: 'link' },
        { path: '/elements/pagination', title: 'pagination', type: 'link' },
        { path: '/elements/grids', title: 'Grids', type: 'link' },
        { path: '/elements/columns', title: 'Columns', type: 'link' },
      ],
    },
    //Forms
    {
      title: 'Forms',
      icon: 'file-text-line',
      type: 'sub',
      Menusub: true,
      selected: false,
      active: false,
      children: [
        {
          path: '/form-module/form-elements',
          title: 'FormElements',
          type: 'link',
        },
        {
          path: '/form-module/advanced-forms',
          title: 'AdvancedForms',
          type: 'link',
        },
        {
          path: '/form-module/form-input-group',
          title: 'Form-input-group',
          type: 'link',
        },
        {
          path: '/form-module/form-uploads',
          title: 'Form Uploads',
          type: 'link',
        },
        {
          path: '/form-module/form-checkbox',
          title: 'Form-Checkbox',
          type: 'link',
        },
        { path: '/form-module/form-radio', title: 'Form-Radio', type: 'link' },
        {
          path: '/form-module/form-switch',
          title: 'Form-Switch',
          type: 'link',
        },
        {
          path: '/form-module/form-select',
          title: 'Form-Select',
          type: 'link',
        },
        {
          path: '/form-module/form-layouts',
          title: 'Form-Layouts',
          type: 'link',
        },
        {
          path: '/form-module/form-validations',
          title: 'Form-Validations',
          type: 'link',
        },
        {
          path: '/form-module/form-editor',
          title: 'Form-Editor',
          type: 'link',
        },
      ],
    },
    //Advanced
    {
      title: 'Advanced Ui',
      icon: 'stack-line',
      type: 'sub',
      Menusub: true,
      active: false,
      selected: false,
      children: [
        { path: '/advanced/rangeslider', title: 'Rangeslider', type: 'link' },
        { path: '/advanced/calender', title: 'Calender', type: 'link' },
        { path: '/advanced/carousel', title: 'Carousel', type: 'link' },
        { path: '/advanced/gallery', title: 'Gallery', type: 'link' },
        { path: '/advanced/sweetalert', title: 'Sweetalert', type: 'link' },
        { path: '/advanced/rating', title: 'Rating', type: 'link' },
        {
          path: '/advanced/draggable-cards',
          title: 'Draggable Cards',
          type: 'link',
        },
        {
          path: '/advanced/notifications',
          title: 'Notifications',
          type: 'link',
        },
        { path: '/advanced/treeview', title: 'Treeview', type: 'link' },
        {
          title: 'File Manager',
          icon: 'database',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/filemanager/filemanager',
              title: 'File Manager',
              type: 'link',
            },
            {
              path: '/filemanager/filemanagerlist',
              title: 'File Manager List',
              type: 'link',
            },
            {
              path: '/filemanager/filedetails',
              title: 'File Details',
              type: 'link',
            },
          ],
        },
      ],
    },
    //Basics
    {
      title: 'Basic Ui',
      icon: 'file-list-3-line',
      type: 'sub',
      Menusub: true,
      selected: false,
      active: false,
      children: [
        { path: '/basicui/dropdown', title: 'Dropdown', type: 'link' },
        { path: '/basicui/modal', title: 'Modal', type: 'link' },
        { path: '/basicui/offcanvas', title: 'OffCanvas', type: 'link' },
        {
          path: '/basicui/tooltip-popovers',
          title: 'Tooltip&popovers',
          type: 'link',
        },
        {
          title: 'Tables',
          icon: 'database',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/tables/basictables',
              title: 'Basic Tables',
              type: 'link',
            },
            { path: '/tables/datatables', title: 'Data Tables', type: 'link' },
            { path: '/tables/edittables', title: 'Edit Tables', type: 'link' },
          ],
        },
      ],
    },

    { headTitle: 'LEVELS' },
    {
      title: 'NestedMenu',
      icon: 'node-tree',
      type: 'sub',
      selected: false,
      Menusub: false,
      active: false,
      children: [
        {
          path: 'javascript:void(0);',
          title: 'Nested-1',
          type: 'link',
          active: false,
        },
        {
          title: 'Nested2',
          icon: 'database',
          type: 'sub',
          selected: false,
          active: false,
          children: [
            {
              path: 'javascript:void(0);',
              title: 'Nested-2-1',
              type: 'link',
              active: false,
            },
            {
              path: 'javascript:void(0);',
              title: 'Nested-2-2',
              type: 'link',
              active: false,
            },
          ],
        },
      ],
    },

    { headTitle: 'MAPS & CHARTS' },
    {
      title: 'Maps',
      icon: 'map-pin-user-line',
      type: 'sub',
      selected: false,
      Menusub: true,
      active: false,
      children: [
        { path: '/maps/leaflet', title: 'Leaflet Maps', type: 'link' },
      ],
    },
    {
      title: 'Charts',
      icon: 'pie-chart-2-line',
      type: 'sub',
      selected: false,
      Menusub: true,
      active: false,
      children: [
        { path: '/charts/apex', title: 'Apexcharts', type: 'link' },
        { path: '/charts/chartjs', title: 'chartJs', type: 'link' },
        { path: '/charts/echarts', title: 'Echarts', type: 'link' },
      ],
    },
    { headTitle: 'PAGES' },
    {
      title: 'Pages',
      icon: 'book-open-line',
      type: 'sub',
      selected: false,
      Menusub: true,
      active: false,
      children: [
        {
          title: 'Profile',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/profile/home', title: 'Home', type: 'link' },
            {
              path: '/profile/profilesettings',
              title: 'Profile Settings',
              type: 'link',
            },
          ],
        },
        {
          title: 'Invoice',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/invoice/invoicelist',
              title: 'Invoice list',
              type: 'link',
            },
            {
              path: '/invoice/invoicedetails',
              title: 'Invoice Details',
              type: 'link',
            },
          ],
        },
        {
          title: 'Blog',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/blog/blog', title: 'Blog', type: 'link' },
            { path: '/blog/blog-details', title: 'Blog Details', type: 'link' },
            { path: '/blog/edit-blog', title: 'Edit Blog', type: 'link' },
          ],
        },
        {
          title: 'Mail',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/mail/chat', title: 'Chat', type: 'link' },
            { path: '/mail/mail', title: 'Mail', type: 'link' },
            {
              path: '/mail/mail-settings',
              title: 'Mail Settings',
              type: 'link',
            },
          ],
        },
        {
          title: 'Ecommerce',
          type: 'sub',
          selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/ecommerce/add-product',
              title: 'Add Product',
              type: 'link',
            },
            { path: '/ecommerce/cart', title: 'Cart', type: 'link' },
            { path: '/ecommerce/checkout', title: 'CheckOut', type: 'link' },
            {
              path: '/ecommerce/edit-product',
              title: 'Edit-Product',
              type: 'link',
            },
            {
              path: '/ecommerce/order-details',
              title: 'Order Details',
              type: 'link',
            },
            { path: '/ecommerce/orders', title: 'Orders', type: 'link' },
            {
              path: '/ecommerce/product-details',
              title: 'Product Details',
              type: 'link',
            },
            {
              path: '/ecommerce/product-list',
              title: 'Product List',
              type: 'link',
            },
            { path: '/ecommerce/products', title: 'Products', type: 'link' },
            { path: '/ecommerce/whislist', title: 'Whislist', type: 'link' },
          ],
        },
        { path: '/page/aboutus', title: 'About Us', type: 'link' },
        { path: '/page/contacts', title: 'Contacts', type: 'link' },
        { path: '/page/pricingtables', title: 'Pricing Tables', type: 'link' },
        { path: '/page/timeline', title: 'Timeline', type: 'link' },
        { path: '/page/team', title: 'Team', type: 'link' },
        { path: '/page/landing', title: 'Landing', type: 'link' },
        { path: '/page/todolist', title: 'Todo list', type: 'link' },
        { path: '/page/tasks', title: 'Tasks', type: 'link' },
        { path: '/page/reviews', title: 'Reviews', type: 'link' },
        { path: '/page/faqs', title: "Faq's", type: 'link' },
        { path: '/page/contactus', title: 'Contact Us', type: 'link' },
        {
          path: '/page/terms-conditions',
          title: 'Terms&Conditions',
          type: 'link',
        },
        { path: '/page/empty', title: 'Empty', type: 'link' },
      ],
    },
    {
      title: 'Icons',
      icon: 'camera-lens-line',
      type: 'sub', selected: false,
      Menusub: true,
      active: false,
      children: [
        { path: '/icons/remixicons', title: 'Remix Icons', type: 'link' },
        { path: '/icons/tablericons', title: 'Tabler Icons', type: 'link' },
      ],
    },
    {
      title: 'Authentication',
      icon: 'error-warning-line',
      type: 'sub', selected: false,
      Menusub: true,
      active: false,
      children: [
        {
          title: 'Sign In',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/signin/basic', title: 'Basic', type: 'link' },
            { path: '/signin/cover', title: 'Cover-1', type: 'link' },
            { path: '/signin/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Sign Up',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/signup/basic', title: 'Basic', type: 'link' },
            { path: '/signup/cover', title: 'Cover-1', type: 'link' },
            { path: '/signup/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Create Password',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/createpassword/basic', title: 'Basic', type: 'link' },
            { path: '/createpassword/cover', title: 'Cover-1', type: 'link' },
            { path: '/createpassword/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Reset Password',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/resetpassword/basic', title: 'Basic', type: 'link' },
            { path: '/resetpassword/cover', title: 'Cover-1', type: 'link' },
            { path: '/resetpassword/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Forgot Password',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/forgotpassword/basic', title: 'Basic', type: 'link' },
            { path: '/forgotpassword/cover', title: 'Cover-1', type: 'link' },
            { path: '/forgotpassword/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Lock Screen',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            { path: '/lockscreen/basic', title: 'Basic', type: 'link' },
            { path: '/lockscreen/cover', title: 'Cover-1', type: 'link' },
            { path: '/lockscreen/cover2', title: 'Cover-2', type: 'link' },
          ],
        },
        {
          title: 'Two-step-verification',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/two-step-verification/basic',
              title: 'Basic',
              type: 'link',
            },
            {
              path: '/two-step-verification/cover',
              title: 'Cover-1',
              type: 'link',
            },
            {
              path: '/two-step-verification/cover2',
              title: 'Cover-2',
              type: 'link',
            },
          ],
        },
        {
          path: '/authentication/undermaintainance',
          title: 'Under Maintainance',
          type: 'link',
        },
        {
          path: '/authentication/underconstruction',
          title: 'Under Construction',
          type: 'link',
        },
        {
          path: '/authentication/comingsoon',
          title: 'Coming Soon',
          type: 'link',
        },
        {
          title: 'Error Pages',
          type: 'sub', selected: false,
          Menusub: true,
          active: false,
          children: [
            {
              path: '/authentication/404error',
              title: '404Error',
              type: 'link',
            },
            {
              path: '/authentication/500error',
              title: '500Error',
              type: 'link',
            },
          ],
        },
      ],
    },
  ];
  // Array
  items = new BehaviorSubject<Menu[]>(this.moduleService.UserModuleList());
  // items =this.moduleService.UserModuleList;
}
