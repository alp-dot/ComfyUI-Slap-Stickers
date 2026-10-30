<script setup>
defineProps({name:String});
const paths={add:['M12 5v14M5 12h14'],duplicate:['M9 9h11v11H9z','M15 9V4H4v11h5'],delete:['M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7'],front:['M4 16h16M4 20h16','M12 12V3m-4 4 4-4 4 4'],back:['M4 4h16M4 8h16','M12 12v9m-4-4 4 4 4-4']};
paths.opacity=['M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16','M12 4v16M15 5v14M18 8v8'];
</script>
<template><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path v-for="(d,i) in paths[name]||[]" :key="i" :d="d" /></svg></template>
