<template>
    <div class="card">
        <h3>{{ $props.title }}</h3>
        <div class="value">
            <h2>{{ $props.value }}</h2> 
            <div :class="[
                'indicator',
                $props.indicatorNum >= 0 ?
                    !invertConditionValue 
                        ? 'positive' 
                        : 'negative' 
                : !invertConditionValue 
                        ? 'negative' 
                        : 'positive' ,
                $props.indicatorIcon == 'visibility' ? 'warning' : ''
            ]">
                <span :class="$props.indicatorIcon ? 'material-icons-outlined': ''">
                    {{ $props.indicatorIcon ? $props.indicatorIcon : $props.indicatorNum>=0 ? `+${$props.indicatorNum}`: $props.indicatorNum }}
                </span>
            </div>
        </div>
        <p>Alumnos atendidos</p>
        <!-- <div class="progress-bar">
            <div
            class="progress"
            :style="{ width: tutor.progress + '%' }"
            ></div>
        </div> -->
    </div>
</template>

<script setup>

const $props = defineProps({
    title: {
        type: String,
        required: true
    },
    invertConditionValue: {
        type: Boolean,
        default: false
    },
    value: {
        type: String,
        required: true,
    },
    indicatorNum: {
        type: Number,
    },
    indicatorIcon: {
        type: String
    },
    subtitle: {
        type: String,
        required: true
    },
})

</script>

<style scoped>
.cards {
  display: flex;
  gap: 20px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.card h3 {
  font-size: 15px;
  color: #222;
  margin-bottom: 10px;
}

.value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.value h2 {
  font-size: 48px;
  font-weight: 600;
  color: #222;
}

.value .indicator {
  border-radius: 50%;
  padding: 5px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value .indicator span {
  font-weight: 800;
  font-size: 12px;
}

.value .indicator.positive {
  background-color: #DCF4F0;
  color: #08B294;
}

.value .indicator.negative {
  background-color: #FCDCDB;
  color: #EE332D;
}

.value .indicator.warning {
  background-color: #FCFAE3;
  color: #CEBD00;
}

.card p {
  font-size: 13px;
  font-weight: 200;
  color: #222;

}
</style>