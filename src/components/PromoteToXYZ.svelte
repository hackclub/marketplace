<script>
	import { onMount } from "svelte";
    let form = {
        name: '',
        street: '',
        city: '',
        state: '',
        zip: ''
      };
    
    // super good page right here 
    export let status = "man idk"
    export let shipId = null;
    let  newPromotion = "null"
    const statuses = `DRAFT
    UNDER_HQ_DIGITAL_REVIEW
    UNDER_HQ_GRANT_REVIEW
    UNDER_HQ_REVIEW
    SHIPPED`.trim().split("\n").map(e=>e.trim())
    newPromotion = statuses[statuses.indexOf(status) + 1] || "null"
    let underReview = true;
    function formatName(name) {
        return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
    function getRoute(name) {
        console.log(name)
        switch(name) {
case "DRAFT":
            return "draft"
            case "UNDER_HQ_DIGITAL_REVIEW":
            return "promote-to-hq-digital-review"
            case "UNDER_HQ_GRANT_REVIEW":
            return "promote-to-grant-review"
            case "UNDER_HQ_REVIEW":
            return "promote-to-hq-review"
            case "SHIPPED":
            return "shipped"
        }
//        return name;
    }
    async function submitToNextReviewProcess() {
        // gulp idk 
        let route = getRoute(newPromotion)
        console.log(route)
        fetch('/api/ships/'+route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: shipId,
            })
        }).then(r=>r.text()).then(r=>{
            alert(r)
            window.location.reload()
        })
    }
    onMount(() => {
        fetch("/api/ships/isUnderReview?shipId="+shipId).then(r=>{
            if(r.status == 400) {
                underReview = false;
            } 
        }).catch(e => {})
    })
</script>

<div>
<p>
    Would you like to promote your ship from {formatName(status)} ->  {formatName(newPromotion)}?
</p>
<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 " disabled={underReview} on:click={submitToNextReviewProcess}>Yes</button>
<form class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4" on:submit|preventDefault={handleSubmit}>
    <h2 class="text-2xl font-semibold text-center">Address Form</h2>
  
    <div>
      <label class="block text-sm font-medium text-gray-700">First name</label>
      <input type="text" bind:value={form.first_name} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
        <label class="block text-sm font-medium text-gray-700">Last name</label>
        <input type="text" bind:value={form.last_name} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Street Address</label>
      <input type="text" bind:value={form.street} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
  
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">City</label>
        <input type="text" bind:value={form.city} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">State</label>
        <input type="text" bind:value={form.state} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>
  
    <div>
      <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
      <input type="text" bind:value={form.zip} class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
  
    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">Submit</button>
  </form>
</div>