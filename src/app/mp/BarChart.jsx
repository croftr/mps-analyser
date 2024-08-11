import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);

function BarChart({ barChartData, onQueryMpByName }) {

  const barChart = React.useRef(null);

  const getMp = (evt) => {
    const res = barChart.current.getElementsAtEventForMode(
      evt,
      'nearest',
      { intersect: true },
      true
    );
    // If didn't click on a bar, `res` will be an empty array
    if (res.length === 0) {
      return;
    }
    
    onQueryMpByName(barChart.current.data.labels[res[0].index]);    
  }

  return (    
      <Bar
        ref={barChart}
        data={barChartData}
        onClick={getMp}
        options={{          
          aspectRatio: 1.5,
        }}
      />    
  );
}

export default BarChart;