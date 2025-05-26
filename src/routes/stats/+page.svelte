<script lang="ts">
export let data;
export let {countOfUsers,onboardedUsersCount = -1,shipsCount = -1,allTimeSessionsCount = -1,approvedTimeCount = -1,totalTimeRecordedWithAllShips = -1} = data
console.log(data)
</script>
<div class="min-h-screen flex flex-col items-center justify-center">

	<h1 class="text-4xl text-center text-red-500 font-semibold" style="font-family: Phantom Sans;">
		Stats
	</h1>
	<p style="font-family: Phantom Sans;">Public stats :3</p>
	<div class="mt-4">
	<p style="font-family: Phantom Sans;">
        Total Users: {countOfUsers}<br>
        Onboarded Users: {onboardedUsersCount}<br>
        Ships Count: {shipsCount}<br>
        All Time Sessions Count: {allTimeSessionsCount}<br>
        Approved Time Count: {approvedTimeCount}<br>
        Total Time Recorded With All Ships: {(totalTimeRecordedWithAllShips / 60 / 60).toFixed(2)} Hours
        </p>
	</div>
</div>
