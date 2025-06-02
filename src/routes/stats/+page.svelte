<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data;
  export let {
    countOfUsers,
    onboardedUsersCount = -1,
    shipsCount = -1,
    allTimeSessionsCount = -1,
    approvedTimeCount = -1,
    totalTimeRecordedWithAllShips = -1
  } = data;

  let barChartCanvas: HTMLCanvasElement;
  let doughnutChartCanvas: HTMLCanvasElement;

  onMount(() => {
    new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: [
          'Total Users',
          'Onboarded Users',
          'Ships',
          'Sessions',
          'Approved Time',
          'Total Hours'
        ],
        datasets: [{
          label: 'Stat Counts',
          data: [
            countOfUsers,
            onboardedUsersCount,
            shipsCount,
            allTimeSessionsCount,
            approvedTimeCount,
            (totalTimeRecordedWithAllShips / 60 / 60).toFixed(2)
          ],
          backgroundColor: [
            '#ef4444',
            '#f97316',
            '#3b82f6',
            '#10b981',
            '#8b5cf6',
            '#ec4899'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Onboarded Users', 'Other Users'],
        datasets: [{
          data: [onboardedUsersCount, countOfUsers - onboardedUsersCount],
          backgroundColor: ['#10b981', '#fbbf24']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  });
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-6">
  <h1 class="text-4xl text-center text-red-500 font-semibold" style="font-family: Phantom Sans;">
    Stats
  </h1>
  <p style="font-family: Phantom Sans;">Public stats :3</p>

  <div class="mt-4 text-center text-lg" style="font-family: Phantom Sans;">
    <p>Total Users: {countOfUsers}</p>
    <p>Onboarded Users: {onboardedUsersCount}</p>
    <p>Ships Count: {shipsCount}</p>
    <p>All Time Sessions Count: {allTimeSessionsCount}</p>
    <p>Approved Time Count: {approvedTimeCount}</p>
    <p>Total Time Recorded With All Ships: {(totalTimeRecordedWithAllShips / 60 / 60).toFixed(2)} Hours</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-1/2 max-h-4xl max-w-4xl">
    <canvas bind:this={barChartCanvas} class="bg-white rounded-2xl shadow-md p-4"></canvas>
    <br />
    <canvas bind:this={doughnutChartCanvas} class="bg-white rounded-2xl shadow-md p-4"></canvas>
  </div>
</div>
