<template>
  <main class="login">
    <figure class="login-image">
        <img src="/public/img/auth/meet-virtual.jpg" alt="">
    </figure>
    <aside class="login-forms"></aside>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login 
.login-image, .login-forms{
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.login .login-image{
    width: 70%;
    height: 100%;
    object-fit: cover;
}

.login .login-image img{
    width: 100%;
    height: 100%;
}


</style>
