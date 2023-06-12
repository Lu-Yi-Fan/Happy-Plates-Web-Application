<template>
    <div style="width: 80%" >
        <ul class="nav nav-tabs">
            <li v-for="tab in tabs" :key="tab" class="nav-item">
                <a class="nav-link" :class="{ active: tab === selected }" @click="setTab(tab)">
                    {{ tab }}
                </a>
            </li>
        </ul>
        <slot></slot>
    </div>
</template>

<script>

export default {
    props: {
        tabs: {
            type: Array, 
            required: true,
        },
        selected: {
            type: String, 
            required: true, 
        }
    },
    methods: {
        setTab(tab) {
            this.$emit('selected', tab);
        }, 

        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>


.nav-tabs{
    justify-content: center;
    display: flex;
    flex-direction: row;
    zoom: 1.5;
    cursor: pointer;
    background-color: inherit;
}



.images {
    margin-left: -50px;
    margin-right: 50px;

}


</style>>
