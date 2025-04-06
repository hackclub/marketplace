<script>
	import { onMount } from "svelte";

    export let timeString = "00:00:00";
    export let startedAt = Date.now();
    export let timeData = null;
    export let shipId = null;
    setInterval(() => {
        timeString = new Date(Date.now() - startedAt).toISOString().substr(11, 8);
    }, 1000)
    export async function startSession(){
        const timerData = await fetch('/api/time/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shipId: shipId
            })
        }).then(r=>r.text());
        console.log(timerData);
        timeData = await fetch('/api/time/status').then(r=>r.json());
    }

onMount(async () => {
    const timerData = await fetch('/api/time/status');
    const timer = await timerData.json();
    console.log(timer);
    timeData = timer;
    if(timer.session){
        startedAt = new Date(timer.createdAt).getTime();
    }
})
   </script>
  <h2 class="font-bold text-lg">Timer</h2>
  <p class="italic">Once u start the timer, if no heartbeats are recived from a tab in 15 mins it will delete ur session and dm u</p>
<!-- <p>{timeString}</p> -->
 {#if timeData}
{#if timeData.session}
<!-- if there is a session show active time string -->
 <!-- show input for "video url" -->
  <div>
    <label>Video URL</label>
    <input type="url"  class="border-2 border-gray-400 rounded-lg" bind:value={timeData.video_link}>
  </div>
 <p>Current time: {timeString}</p>
{:else}
<button class="bg-red-400 text-white rounded-lg px-4 py-2 font-bold" on:click={startSession}>Start!</button>
{/if}
<button  class="bg-red-400 text-white rounded-lg px-4 py-2 font-bold" >Stop!</button>
    {/if}