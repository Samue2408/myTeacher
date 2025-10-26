<template>
  <div class="payment-container">
    <div class="payment-content">
      <div class="payment-left">
        <h3>Select Payment Option</h3>
        <p class="muted">All transactions are secure and encrypted</p>

        <div class="payment-option">
          <label class="option">
            <input type="radio" name="payment" value="paypal" />
            <span>Paypal</span>
            <figure class="images">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                alt="PayPal"
              />
            </figure>
          </label>

          <label class="option">
            <input type="radio" name="payment" value="card" checked />
            <span>Credit card</span>
            <figure class="images">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                class="card-icon"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="MasterCard"
                class="card-icon"
              />
            </figure>
          </label>

          <div class="card-form">
            <input type="text" placeholder="Card Number" />
            <div class="row">
              <input type="text" placeholder="Name on card" />
              <input type="text" placeholder="MM/YY" />
              <input type="text" placeholder="CVV" />
            </div>
          </div>

          <label class="option">
            <input type="radio" name="payment" value="google" />
            <span>Google Pay</span>
            <div class="images">
              <img
                src="https://www.computerhope.com/jargon/g/google-pay.png"
                alt="Google Pay"
              />
            </div>
          </label>

          <label class="option">
            <input type="radio" name="payment" value="cash" />
            <span>Cash on delivery</span>
            <div class="images">
              <img
                src="https://static.vecteezy.com/system/resources/previews/013/800/492/non_2x/banknote-dollar-green-cash-pack-of-dollars-money-saving-exchange-finance-and-budget-concept-3d-icon-cartoon-minimal-style-illustration-vector.jpg"
                alt="money"
              />
            </div>
          </label>

          <button class="btn-pay">Pay | $1,220.80</button>
          <p class="terms">
            By clicking this, I agree to Treva
            <a href="#">Terms & Conditions</a> and
            <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>

      <div class="payment-right">
        <div class="booking-summary">
          <div class="tutor-info">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Tutor"
            />
            <div>
              <div class="flex gap--md flex--center-y flex--between">
                <h4>Juan Pérez</h4>
                <p>Fecha: 30 Oct 2025 - 4:00 PM</p>
              </div>
              <p>Materia: Matemáticas avanzadas</p>
              <p>Duración: 1 hora</p>
            </div>
          </div>
          <p class="note">
            Al confirmar tu pago, reservarás esta sesión con
            <strong>Juan Pérez</strong>. Si necesitas reprogramar, podrás
            hacerlo desde tu panel.
          </p>
        </div>
        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$1,120.00</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>$100.80</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>$1,220.80</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-container {
  font-family: "Inter", sans-serif;
  color: #333;
  background-color: #f9fafb;
  padding: 2rem;
  height: calc(100vh - 8vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.payment-content {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.payment-left,
.payment-right {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.payment-left {
  flex: 1;
  max-width: 500px;
}

.payment-right {
  flex: 1;
  max-width: 540px;
}

.muted {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  margin-bottom: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  border-color: #b4a6ff;
}

.option input {
  width: 18px;
  height: 18px;
  accent-color: #6c5ce7;
  margin-right: 1rem;
}

.option.active {
  background-color: #6c5ce7;
}

.option span {
  flex: 1;
  font-weight: 500;
  font-size: 1rem;
  color: #333;
}

.option .images {
  display: flex;
  align-items: center;
  gap: 6px;
}

.option .images img {
  width: 40px;
  height: auto;
  object-fit: contain;
}

.option.active {
  border-color: #6c5ce7;
  background: #f3f0ff;
}

.card-icon {
  width: 40px;
}

.card-form {
  padding-left: 1.8rem;
  margin-bottom: 1rem;
  position: relative;
}

.card-form::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #f3f0ff;
}

.card-form input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
}

.row {
  display: flex;
  gap: 0.5rem;
}

.btn-pay {
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.7rem;
}

.btn-pay:hover {
  background: #5846d6;
}

.terms {
  font-size: 0.85rem;
  text-align: center;
  margin-top: 0.5rem;
}

.terms a {
  color: #6c5ce7;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.cart-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.cart-item p {
  margin: 0;
  font-weight: 500;
}

.cart-item span {
  font-size: 0.9rem;
  color: #555;
}

.coupon input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin: 1rem 0;
}

.order-summary {
  background: #f7f7fb;
  border-radius: 8px;
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total {
  font-weight: 700;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
}

.booking-summary {
  background: #f7f7fb;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.2rem;
}

.tutor-info {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.tutor-info img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.tutor-info h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.tutor-info p {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

.note {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>

<script setup></script>
