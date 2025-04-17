<script>
    // super good page right here 
    export let status = "man idk"
    let  newPromotion = "null"
    const statuses = `DRAFT
    UNDER_HQ_DIGITAL_REVIEW
    UNDER_HQ_GRANT_REVIEW
    UNDER_HQ_REVIEW
    SHIPPED`.trim().split("\n").map(e=>e.trim())
    newPromotion = statuses[statuses.indexOf(status) + 1] || "null"
    function formatName(name) {
        return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
</script>

<div>
<p>
    Would you like to promote your ship from {formatName(status)} ->  {formatName(newPromotion)}?
</p>
<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Yes</button>
</div>