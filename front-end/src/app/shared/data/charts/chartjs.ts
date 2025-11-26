import { ChartConfiguration, ChartData, ChartType } from "chart.js";

//Line Charts
export const lineChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    legend: {
      display: false,
      labels: {
        //display: false
      }
    },
  },
  scales: { 
    y: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 10,
        // max: 80,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    },
    x: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 11,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    }
  }
};

export const lineChartType: ChartType = 'line';
export const lineChartLegend = true;
export const lineChartData: ChartConfiguration['data'] = {
   datasets: [{
            label: 'My First dataset',
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            data: [0, 10, 5, 2, 20, 30, 45],
        }],
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July'
    
  ],
};

//STACKED BAR CHART (Vertical)
export const barChart2Options: ChartConfiguration['options'] = {
  maintainAspectRatio: true,
  responsive: true,

  plugins:{legend: {
    display: false,
  },},
  scales: {
    y: {
      stacked: true,
      ticks: {
        color: "rgba(99, 102, 241,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    },
    x: {
      stacked: true,
      ticks: {
        color: "rgba(99, 102, 241,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    }
  },

};
export const barChart2Type: ChartType = 'bar';
export const barChart2Legend = true;
export const barChart2height = 93 ;
// export let barChart2Plugins = []

export const barChart2Data: ChartConfiguration['data'] = {datasets:[
  {
    label:'Sales',
    data: [35, 45, 32, 45, 30, 53,36,45,27,60,53,42],
    backgroundColor: '#0052cc',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.3,
    borderColor: "#b1b9f3",
    hoverBackgroundColor: "#b1b9ee"
  }, {
    label:'Profits',
    data: [45, 56, 22, 38, 60, 59,44,25,40,30,47,28],
    backgroundColor: '#8c8eef',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.3,
    borderColor: "#6d7ce4",
    hoverBackgroundColor: "#6d7cb3"
  }, {
    label:'Revenue',
    data: [36, 21, 15, 12, 15, 20,30,20,25,15,10,30],
    backgroundColor: '#b7b9ec',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.3,
    borderColor: "#4454c3",
    hoverBackgroundColor: "#4454b0"
  }
], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","jul","aug","sep","oct","nov","dec"],

};

export const barChart2Options1: ChartConfiguration['options'] = {

  maintainAspectRatio: true,
  responsive: true,

  plugins:{legend: {
    display: false,
  },},
  scales: {
    y: {

      stacked: true,
      ticks: {
        color: "rgba(171, 167, 167,0.9)",
      },

      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    },
    x: {
      stacked: true,
      ticks: {
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },

    }
  },

};
export const barChart2Type1: ChartType = 'bar';
export const barChart2Legend1 = true;
// export let barChart2Plugins = []

export const barChart2Data1: ChartConfiguration['data'] = {datasets:[
  {
    label:'Orders',
    data: [10, 24, 20, 25, 35, 50,36,45,27,60,53,42],
    backgroundColor: '#0052cc',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.3,
    borderColor: "#b1b9f3",
    hoverBackgroundColor: "#b1b9ee"
  },

], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","jul","aug","sep","oct","nov","dec"]
};

//DoughNut Chart and Pie chart data

export const PieChartData: ChartConfiguration['data'] = {
  datasets: [
    {
      data: [40, 20],
      backgroundColor: ['#5a66f1', '#3892ff'],
    },
  ],
  
  labels: ['Jan', 'Feb'],
};

export const PieChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  // cutout: 90,
  aspectRatio: 90,
};
export const DoughnutChartType: ChartType = 'doughnut';
export const PieChartType: ChartType = 'pie';

//SOLID COLOR
export const solidColorChartOptions: ChartConfiguration['options'] = {

  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 10,
        // max: 80,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    },
    x: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 11,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',

      },
    }
  }

};
export const solidColorLegend = true;
export const solidColorChartType: ChartType = 'bar';
export const solidColorChartData: ChartConfiguration['data'] = {datasets:[{
  label: '# of Votes',
  data: [12, 39, 20, 10, 25, 18],
  barPercentage: 0.6
}],
labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
};

export const polarAreaChartLabels: string[] = ['Priamry', 'teal', 'Warning', 'Gray','Success'];
export const polarAreaChartData: ChartData<'polarArea'> = {
  datasets: [
    {
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        'rgba(99, 102, 241, 1)', // Primary color
        'rgba(75, 192, 192, 1)', // Teal color
        'rgba(166, 142, 94, 1)', // Warning color
        'rgba(201, 203, 207, 1)', // Gray color
        'rgba(94, 166, 142, 1)', // Success color
      ],
    },
  ],
  labels: polarAreaChartLabels,
};
export const  polarAreaLegend = true;
export const polarChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{legend: {
    display: false,
  },
}
};
export const polarAreaChartType: ChartType = 'polarArea';
