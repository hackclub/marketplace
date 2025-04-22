<script>
	import { onMount } from "svelte";

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
            return "promote-to-hq-grant-review"
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
</div>