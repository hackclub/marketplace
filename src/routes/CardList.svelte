<script>
    export let items = [];
  </script>
  
  <div class="flex flex-wrap gap-4">
    {#each items as item}
      <div class="w-80  rounded-lg p-4 relative">
        <div class="h-40 bg-orange-500 rounded-lg"></div>
        <img src={item.avatar} alt="Avatar" class="w-12 h-12 rounded-full absolute bottom-37 left-6  border-2 border-white">
        <div class="mt-6">
          <h2 class="text-black font-bold text-lg">{item.title}</h2>
          <p class="text-gray-700">@{item.author}</p>
          <p class="text-orange-700">{item.description}</p>
        </div>
      </div>
    {/each}
  </div>
  
