
export const getCostByTypeData = () => ({
  labels: ['Oil Change', 'Tires', 'Brakes', 'Engine', 'Other'],
  datasets: [
    {
      label: 'Expenses',
      data: [350, 800, 600, 1200, 400],
      backgroundColor: [
        'rgba(24, 119, 242, 0.7)',
        'rgba(90, 93, 235, 0.7)',
        'rgba(140, 82, 255, 0.7)',
        'rgba(194, 75, 184, 0.7)',
        'rgba(229, 69, 109, 0.7)',
      ],
      borderColor: [
        'rgb(24, 119, 242)',
        'rgb(90, 93, 235)',
        'rgb(140, 82, 255)',
        'rgb(194, 75, 184)',
        'rgb(229, 69, 109)',
      ],
      borderWidth: 1,
    },
  ],
});

export const getMaintenanceOverTimeData = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Cost',
      data: [0, 120, 120, 350, 350, 500, 650, 650, 950, 1100, 1200, 1400],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Maintenance Events',
      data: [0, 1, 0, 1, 0, 1, 1, 0, 2, 1, 1, 1],
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    },
  ],
});

export const getMaintenanceFrequencyData = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Maintenance Frequency',
      data: [0, 1, 0, 1, 0, 1, 1, 0, 2, 1, 1, 1],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
});
