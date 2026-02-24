<script setup lang="ts">
import ComponentCard from "@/components/admin/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/admin/layout/AdminLayout.vue";
import {onMounted, reactive, ref} from "vue";
import Chart from 'primevue/chart';
import api from "@/api.ts";

const currentPageTitle = ref("DASHBOARD");
const monthChartData = ref();
const yearChartData = ref();
const chartOptions = ref();
const mostViewedMonthly = reactive<any[]>([]);
const mostViewedYearly = reactive<any[]>([]);

onMounted(() => {
  //chartData.value = setMonthChartData();
  chartOptions.value = setChartOptions();
  loadStats();
});

const loadStats = async () => {
  try {
    let response = await api.get('/post/most-viewed-month');
    mostViewedMonthly.push(...response.data);
    setMonthChartData(mostViewedMonthly);
    //same for year stats
     response = await api.get('/post/most-viewed-year');
    mostViewedYearly.push(...response.data);
    setYearChartData(mostViewedYearly);
  } catch (error) {
    console.error('Error loading most viewed posts:', error);
  }
}

const setMonthChartData = (mostViewedMonthly: Array<any>) => {
  let labels: string[] = [];
  let visitsData: number[] = [];
  mostViewedMonthly.forEach((item) => {
    labels.push(item.post.title);
    visitsData.push(item.clicks);
  })
  monthChartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Views',
        data: visitsData,
        backgroundColor: ['rgba(97, 78, 157, 0.7)'/*rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'*/],
        borderColor: ['rgba(10, 9, 27, 0.7)'/*, 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'*/],
        borderWidth: 1
      }
    ]
  };
};


const setYearChartData = (mostViewedYearly: Array<any>) => {
  let labels: string[] = [];
  let visitsData: number[] = [];
  mostViewedYearly.forEach((item) => {
    labels.push(item.title);
    visitsData.push(item.total_clicks);
  })
  yearChartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Views',
        data: visitsData,
        backgroundColor: ['rgba(10,53,117,0.7)'/*rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'*/],
        borderColor: ['rgba(5,34,76,0.7)'/*, 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'*/],
        borderWidth: 1
      }
    ]
  };
};


const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColorSecondary
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}
</script>

<template>

  <PageBreadcrumb :pageTitle="currentPageTitle"/>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class=" col-span-12 md:col-span-6">
      <ComponentCard title="Most Viewed this Month">
        <Chart type="bar" :data="monthChartData" :options="chartOptions"/>
      </ComponentCard>
    </div>
    <div class=" col-span-12 md:col-span-6">
      <ComponentCard title="Most Viewed this Year">
        <Chart type="bar" :data="yearChartData" :options="chartOptions"/>
      </ComponentCard>
    </div>

  </div>
</template>

<style scoped>

</style>