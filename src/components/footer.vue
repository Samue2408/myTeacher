<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Columna 1 -->
      <div class="footer__col">
        <h2 class="footer__logo">my<span>TEACHER</span></h2>
        <p class="footer__text">
          Conecta con tutores calificados<br />en cualquier momento y lugar
        </p>
      </div>

      <!-- Columna 2 -->
      <div class="footer__col">
        <h3 class="footer__title">Enlaces rápidos</h3>
        <ul class="footer__links">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Buscar tutores</a></li>
          <li><a href="#">Cómo funciona</a></li>
          <li><a href="#">Preguntas frecuentes (FAQ)</a></li>
          <li><a href="#">Blog / Recursos</a></li>
        </ul>
      </div>

      <!-- Columna 3 -->
      <div class="footer__col">
        <h3 class="footer__title">Soporte y contacto</h3>
        <ul class="footer__contact">
          <li>
            <a href="mailto:soporte@myteacher.com">soporte@myteacher.com</a>
          </li>
          <li><a href="tel:+573001112233">+57 XXX XXX XXXX</a></li>
          <li><a href="#">Chat en línea / WhatsApp</a></li>
        </ul>
      </div>

      <!-- Columna 4 -->
      <div class="footer__col">
        <h3 class="footer__title">Redes sociales</h3>
        <div class="footer__social">
          <a href="#"><span class="material-icons-outlined">facebook</span></a>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>© 2025 myTEACHER. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: #fff;
  font-family: "Inter", sans-serif;
}

.footer__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  padding: 2.5rem;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__logo {
  font-weight: 700;
  font-size: 1.3rem;
}

.footer__logo span {
  color: #ffffff;
}

.footer__text {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #f2f2f2;
}

.footer__title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.footer__links,
.footer__contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__links li,
.footer__contact li {
  margin-bottom: 0.3rem;
}

.footer__links a,
.footer__contact a {
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
  
}

.footer__links a:hover,
.footer__contact a:hover {
  opacity: 0.8;
}

.footer__social {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.footer__social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
  text-decoration: none;
  overflow: hidden;
}

.footer__social a:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.25);
  opacity: 0.9;
}

.footer__social a .material-icons-outlined {
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer__bottom {
  background-color: #e9eef9;
  text-align: center;
  padding: 1rem;
  color: #333;
  font-size: 0.85rem;
}
</style>

