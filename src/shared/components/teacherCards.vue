<template>
  <div class="card">
    <div class="card-header">
      <div class="avatar">
        <img :src="teacher.img" :alt="teacher.name" />
      </div>
      <div class="info">
        <h3>{{ teacher.name }}</h3>
        <p class="desc">{{ teacher.description }}</p>
        <p class="subj">{{ teacher.subject }}</p>
      </div>
    </div>

    <div class="card-body">
      <div class="price">
        <span>Precio</span>
        <strong>$ {{ teacher.price.toLocaleString('es-CO') }}</strong>
      </div>
      <button @click="goToTutoringProfile(teacher.id)">Ver perfil</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({ teacher: Object })
const goToTutoringProfile = id => router.push({ name: 'profile', params: { id } })
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  transition: transform .2s ease, box-shadow .2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.info {
  flex: 1;
}
.info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
}
.info .desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}
.info .subj {
  font-size: 12px;
  color: var(--color-primary, #0a8e0a);
  margin-top: 3px;
  font-weight: 500;
}
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.price {
  display: flex;
  flex-direction: column;
}
.price span {
  font-size: 11px;
  color: #999;
}
.price strong {
  font-size: 14px;
  color: #0a8e0a;
}
button {
  background: var(--color-primary, #0a8e0a);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s ease;
}
button:hover {
  background: #097a09;
}
@media (min-width: 800px) {
  .card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
  }
  .card-header {
    flex: 1.5;
  }
  .card-body {
    flex: 1;
    margin-top: 0;
    border-top: none;
    border-left: 1px solid #eee;
    padding-top: 0;
    padding-left: 18px;
  }
}
</style>
