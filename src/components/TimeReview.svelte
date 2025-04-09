<script>
    export let data = {};
</script>

<div>
<details on:toggle={() => alert("hi")}>
    <summary><div>
<h2>ID: {data?.id}</h2>
<img src="https://cachet.dunkirk.sh/users/{data?.userId}/r" />
     </div></summary>
</details>
</div>
